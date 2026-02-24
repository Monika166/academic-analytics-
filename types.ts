// Fix: Added React import to provide the React namespace for type definitions
import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  // Fix: Ensure React namespace is available for ReactNode
  icon: React.ReactNode;
  color?: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  // Fix: Ensure React namespace is available for ReactNode
  icon: React.ReactNode;
  color: string;
}
