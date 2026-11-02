import React, { type JSX } from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useDocsData, useLayoutDocsSidebar } from "@docusaurus/plugin-content-docs/client";

import { GlassGroup, GlassGroupItem } from "@/components/glass/glass-group";
import { cn } from "@/lib/utils";

/** The subset of a `themeConfig.navbar.items` entry this navbar renders as a page link. */
interface NavbarLinkItem {
  type?: string;
  to?: string;
  label?: string;
  sidebarId?: string;
  docsPluginId?: string;
  position?: "left" | "right";
}

type Orientation = "horizontal" | "vertical";

interface NavLinksProps {
  orientation?: Orientation;
  /** Called after a link is followed — the mobile sheet closes itself with it. */
  onNavigate?: () => void;
  className?: string;
}

/** Left-positioned page links from the config; search and locale render elsewhere. */
function useNavbarLinkItems(): NavbarLinkItem[] {
  const items = useThemeConfig().navbar.items as NavbarLinkItem[];
  return items.filter(
    (item) =>
      item.position !== "right" && (item.type === "docSidebar" || Boolean(item.to))
  );
}

/** Active when the path is the section root or anything below it. */
function isActivePath(pathname: string, sectionRoot: string): boolean {
  const root = sectionRoot.replace(/\/$/, "");
  return pathname === root || pathname.startsWith(`${root}/`);
}

interface GlassNavLinkProps {
  to: string;
  label: string;
  active: boolean;
  orientation: Orientation;
  onNavigate?: () => void;
}

function GlassNavLink({ to, label, active, orientation, onNavigate }: GlassNavLinkProps): JSX.Element {
  return (
    <GlassGroupItem asChild selected={active}>
      {/* aria-current is what GlassGroup's sliding indicator follows */}
      <Link
        to={to}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={cn(orientation === "vertical" && "w-full justify-start")}
      >
        {label}
      </Link>
    </GlassGroupItem>
  );
}

type ItemLinkProps = Omit<GlassNavLinkProps, "to" | "label" | "active"> & { item: NavbarLinkItem };

/**
 * A docs sidebar entry links to the sidebar's first doc and is active anywhere
 * under the docs plugin's base path (locale-aware, e.g. /phatsss-blog/th/docs).
 */
function DocSidebarNavLink({ item, ...rest }: ItemLinkProps): JSX.Element | null {
  const sidebar = useLayoutDocsSidebar(item.sidebarId ?? "", item.docsPluginId);
  const docsRoot = useDocsData(item.docsPluginId).path;
  const { pathname } = useLocation();
  const to = sidebar.link?.path;
  if (!to) return null;
  return (
    <GlassNavLink to={to} label={item.label ?? sidebar.link?.label ?? ""} active={isActivePath(pathname, docsRoot)} {...rest} />
  );
}

function PageNavLink({ item, ...rest }: ItemLinkProps): JSX.Element {
  const { pathname } = useLocation();
  const resolved = useBaseUrl(item.to ?? "/");
  return <GlassNavLink to={item.to ?? "/"} label={item.label ?? ""} active={isActivePath(pathname, resolved)} {...rest} />;
}

/**
 * The navbar's page links. Horizontal: one shared liquid-glass capsule whose
 * indicator slides to the current section. Vertical (inside the glass sheet):
 * plain items — glass can't sample glass — that fill when selected.
 */
export function NavLinks({ orientation = "horizontal", onNavigate, className }: NavLinksProps): JSX.Element {
  const items = useNavbarLinkItems();
  const links = items.map((item) =>
    item.type === "docSidebar" ? (
      <DocSidebarNavLink key={`${item.sidebarId}`} item={item} orientation={orientation} onNavigate={onNavigate} />
    ) : (
      <PageNavLink key={item.to} item={item} orientation={orientation} onNavigate={onNavigate} />
    )
  );
  if (orientation === "vertical") {
    return <div className={cn("flex flex-col gap-0.5", className)}>{links}</div>;
  }
  return (
    <GlassGroup indicator className={className}>
      {links}
    </GlassGroup>
  );
}
