// Type for the navItems array
export interface NavItem {
  label: string;
  path: string;
}

// Props for the PageLinks component
export interface PageLinksProps {
  toLink: string;
  title: string;
  classes?: string;
  click?: () => void;
}
