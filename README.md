# Trainlog Utilities

## Overview

The following instructions will help you reproduce the build and ensure that the generated sources match those in the extension.

## Operating System and Environment Requirements

- **Operating System**: macOS, Linux, or Windows
- **Node.js**: v14.x or higher
- **npm**: v6.x or higher

## Tools and Utilities

No additional tools or utilities are required.

## Installation Instructions

1. Install the required dependencies:
    ```sh
    npm install
    ```

## Build Instructions

To generate an identical copy of the extension from the source code, follow these steps:

1. Run the build script:
    ```sh
    npm run build:firefox
    ```

## Verification

The finished build will be found in `./extension/`