'use client';

import * as React from "react";

export type ToastActionElement = React.ReactNode;

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  action?: ToastActionElement;
}
