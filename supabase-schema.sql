-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create songs table
CREATE TABLE public.songs (
  id TEXT PRIMARY KEY,
  youtube_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration INTEGER NOT NULL,
  thumbnail TEXT NOT NULL
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  current_song JSONB,
  current_position REAL DEFAULT 0,
  is_playing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room_users table (many-to-many relationship)
CREATE TABLE public.room_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Create queue_items table
CREATE TABLE public.queue_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  song JSONB NOT NULL,
  position INTEGER NOT NULL,
  added_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Songs policies
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert songs" ON public.songs
  FOR INSERT WITH CHECK (true);

-- Rooms policies
CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rooms" ON public.rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Room creators can update their rooms" ON public.rooms
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Room creators can delete their rooms" ON public.rooms
  FOR DELETE USING (auth.uid() = creator_id);

-- Room users policies
CREATE POLICY "Anyone can view room users" ON public.room_users
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join rooms" ON public.room_users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.room_users
  FOR DELETE USING (auth.uid() = user_id);

-- Queue items policies
CREATE POLICY "Anyone can view queue items" ON public.queue_items
  FOR SELECT USING (true);

CREATE POLICY "Room creators can manage queue" ON public.queue_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE rooms.id = queue_items.room_id 
      AND rooms.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to queue" ON public.queue_items
  FOR INSERT WITH CHECK (auth.uid() = added_by);

-- Messages policies
CREATE POLICY "Room members can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.room_users 
      WHERE room_users.room_id = messages.room_id 
      AND room_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.room_users 
      WHERE room_users.room_id = messages.room_id 
      AND room_users.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_rooms_creator_id ON public.rooms(creator_id);
CREATE INDEX idx_room_users_room_id ON public.room_users(room_id);
CREATE INDEX idx_room_users_user_id ON public.room_users(user_id);
CREATE INDEX idx_queue_items_room_id ON public.queue_items(room_id);
CREATE INDEX idx_queue_items_position ON public.queue_items(room_id, position);
CREATE INDEX idx_messages_room_id ON public.messages(room_id);
CREATE INDEX idx_messages_created_at ON public.messages(room_id, created_at);

-- Function to handle user creation (IMPROVED VERSION)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user record with better error handling
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate key errors
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user record: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create user records for existing auth users
CREATE OR REPLACE FUNCTION public.create_missing_user_records()
RETURNS void AS $$
DECLARE
  auth_user RECORD;
BEGIN
  -- Loop through all auth users that don't have a corresponding users record
  FOR auth_user IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
  LOOP
    -- Create user record for each missing user
    INSERT INTO public.users (id, email, username)
    VALUES (
      auth_user.id,
      auth_user.email,
      COALESCE(
        auth_user.raw_user_meta_data->>'username',
        split_part(auth_user.email, '@', 1)
      )
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create records for any existing users
SELECT public.create_missing_user_records();

-- Clean up the temporary function
DROP FUNCTION public.create_missing_user_records();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
