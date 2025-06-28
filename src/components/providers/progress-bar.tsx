"use client";

import React from "react";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

function ProgressBarProvider({ children }: React.PropsWithChildren) {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#fffd00"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}

export default ProgressBarProvider;
