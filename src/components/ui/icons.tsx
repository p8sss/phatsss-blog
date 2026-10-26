import { HugeiconsIcon } from "@hugeicons/react";
import type { SVGProps } from "react";

import AppWindowIconRaw from "@hugeicons/core-free-icons/AppWindowIcon";
import ApiIconRaw from "@hugeicons/core-free-icons/ApiIcon";
import Alert02IconRaw from "@hugeicons/core-free-icons/Alert02Icon";
import AlertDiamondIconRaw from "@hugeicons/core-free-icons/AlertDiamondIcon";
import ArrowDown01IconRaw from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowLeft01IconRaw from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01IconRaw from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowUpRight01IconRaw from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import BankIconRaw from "@hugeicons/core-free-icons/BankIcon";
import BloggerIconRaw from "@hugeicons/core-free-icons/BloggerIcon";
import Bookmark01IconRaw from "@hugeicons/core-free-icons/Bookmark01Icon";
import BookmarkCheck01IconRaw from "@hugeicons/core-free-icons/BookmarkCheck01Icon";
import BookOpen01IconRaw from "@hugeicons/core-free-icons/BookOpen01Icon";
import BoxIconRaw from "@hugeicons/core-free-icons/BoxIcon";
import BracketsIconRaw from "@hugeicons/core-free-icons/BracketsIcon";
import Briefcase01IconRaw from "@hugeicons/core-free-icons/Briefcase01Icon";
import Calendar01IconRaw from "@hugeicons/core-free-icons/Calendar01Icon";
import Chart01IconRaw from "@hugeicons/core-free-icons/Chart01Icon";
import CheckmarkCircle01IconRaw from "@hugeicons/core-free-icons/CheckmarkCircle01Icon";
import CheckIconRaw from "@hugeicons/core-free-icons/CheckIcon";
import CircleIconRaw from "@hugeicons/core-free-icons/CircleIcon";
import ChevronDownIconRaw from "@hugeicons/core-free-icons/ChevronDownIcon";
import ChevronRightIconRaw from "@hugeicons/core-free-icons/ChevronRightIcon";
import Clock01IconRaw from "@hugeicons/core-free-icons/Clock01Icon";
import CloudIconRaw from "@hugeicons/core-free-icons/CloudIcon";
import CodeIconRaw from "@hugeicons/core-free-icons/CodeIcon";
import ComponentIconRaw from "@hugeicons/core-free-icons/ComponentIcon";
import Copy01IconRaw from "@hugeicons/core-free-icons/Copy01Icon";
import CreditCardIconRaw from "@hugeicons/core-free-icons/CreditCardIcon";
import CubeIconRaw from "@hugeicons/core-free-icons/CubeIcon";
import Cursor01IconRaw from "@hugeicons/core-free-icons/Cursor01Icon";
import DashboardSquare01IconRaw from "@hugeicons/core-free-icons/DashboardSquare01Icon";
import DatabaseIconRaw from "@hugeicons/core-free-icons/DatabaseIcon";
import DeliveryBox01IconRaw from "@hugeicons/core-free-icons/DeliveryBox01Icon";
import Diamond01IconRaw from "@hugeicons/core-free-icons/Diamond01Icon";
import FeatherIconRaw from "@hugeicons/core-free-icons/FeatherIcon";
import FileCodeIconRaw from "@hugeicons/core-free-icons/FileCodeIcon";
import FilterIconRaw from "@hugeicons/core-free-icons/FilterIcon";
import FireIconRaw from "@hugeicons/core-free-icons/FireIcon";
import Folder01IconRaw from "@hugeicons/core-free-icons/Folder01Icon";
import GithubIconRaw from "@hugeicons/core-free-icons/GithubIcon";
import GlobeIconRaw from "@hugeicons/core-free-icons/GlobeIcon";
import GridIconRaw from "@hugeicons/core-free-icons/GridIcon";
import Home01IconRaw from "@hugeicons/core-free-icons/Home01Icon";
import Home06IconRaw from "@hugeicons/core-free-icons/Home06Icon";
import Invoice01IconRaw from "@hugeicons/core-free-icons/Invoice01Icon";
import LaptopIconRaw from "@hugeicons/core-free-icons/LaptopIcon";
import Layers02IconRaw from "@hugeicons/core-free-icons/Layers02Icon";
import Mail01IconRaw from "@hugeicons/core-free-icons/Mail01Icon";
import Menu01IconRaw from "@hugeicons/core-free-icons/Menu01Icon";
import MobileNavigator01IconRaw from "@hugeicons/core-free-icons/MobileNavigator01Icon";
import Money01IconRaw from "@hugeicons/core-free-icons/Money01Icon";
import MoneyBag01IconRaw from "@hugeicons/core-free-icons/MoneyBag01Icon";
import Moon02IconRaw from "@hugeicons/core-free-icons/Moon02Icon";
import MoreHorizontalIconRaw from "@hugeicons/core-free-icons/MoreHorizontalIcon";
import NoteIconRaw from "@hugeicons/core-free-icons/NoteIcon";
import PackageIconRaw from "@hugeicons/core-free-icons/PackageIcon";
import PaintBrush01IconRaw from "@hugeicons/core-free-icons/PaintBrush01Icon";
import PenTool02IconRaw from "@hugeicons/core-free-icons/PenTool02Icon";
import PuzzleIconRaw from "@hugeicons/core-free-icons/PuzzleIcon";
import Rocket01IconRaw from "@hugeicons/core-free-icons/Rocket01Icon";
import SchoolIconRaw from "@hugeicons/core-free-icons/SchoolIcon";
import Search01IconRaw from "@hugeicons/core-free-icons/Search01Icon";
import SecurityLockIconRaw from "@hugeicons/core-free-icons/SecurityLockIcon";
import Settings01IconRaw from "@hugeicons/core-free-icons/Settings01Icon";
import ShoppingBag01IconRaw from "@hugeicons/core-free-icons/ShoppingBag01Icon";
import Smartphone01IconRaw from "@hugeicons/core-free-icons/Smartphone01Icon";
import SparklesIconRaw from "@hugeicons/core-free-icons/SparklesIcon";
import Store01IconRaw from "@hugeicons/core-free-icons/Store01Icon";
import Sun03IconRaw from "@hugeicons/core-free-icons/Sun03Icon";
import Tag01IconRaw from "@hugeicons/core-free-icons/Tag01Icon";
import TerminalIconRaw from "@hugeicons/core-free-icons/TerminalIcon";
import TranslateIconRaw from "@hugeicons/core-free-icons/TranslateIcon";
import UserIconRaw from "@hugeicons/core-free-icons/UserIcon";
import Wallet01IconRaw from "@hugeicons/core-free-icons/Wallet01Icon";
import WorkHistoryIconRaw from "@hugeicons/core-free-icons/WorkHistoryIcon";
import Wrench01IconRaw from "@hugeicons/core-free-icons/Wrench01Icon";

type IconProps = Omit<SVGProps<SVGSVGElement>, 'strokeWidth'> & {
  size?: number;
  strokeWidth?: number;
};

function createIcon(icon: unknown) {
  return function Icon({
    size = 16,
    strokeWidth = 1.5,
    ...props
  }: IconProps) {
    return (
      <HugeiconsIcon
        icon={icon as never}
        size={size}
        strokeWidth={strokeWidth}
        {...props}
      />
    );
  };
}

export const AppWindowIcon = createIcon(AppWindowIconRaw);
export const ApiIcon = createIcon(ApiIconRaw);
export const Alert02Icon = createIcon(Alert02IconRaw);
export const AlertDiamondIcon = createIcon(AlertDiamondIconRaw);
export const ArrowDown01Icon = createIcon(ArrowDown01IconRaw);
export const ArrowLeft01Icon = createIcon(ArrowLeft01IconRaw);
export const ArrowRight01Icon = createIcon(ArrowRight01IconRaw);
export const ArrowUpRight01Icon = createIcon(ArrowUpRight01IconRaw);
export const BankIcon = createIcon(BankIconRaw);
export const BloggerIcon = createIcon(BloggerIconRaw);
export const Bookmark01Icon = createIcon(Bookmark01IconRaw);
export const BookmarkCheck01Icon = createIcon(BookmarkCheck01IconRaw);
export const BookOpen01Icon = createIcon(BookOpen01IconRaw);
export const BoxIcon = createIcon(BoxIconRaw);
export const BracketsIcon = createIcon(BracketsIconRaw);
export const Briefcase01Icon = createIcon(Briefcase01IconRaw);
export const Calendar01Icon = createIcon(Calendar01IconRaw);
export const Chart01Icon = createIcon(Chart01IconRaw);
export const CheckmarkCircle01Icon = createIcon(CheckmarkCircle01IconRaw);
export const CheckIcon = createIcon(CheckIconRaw);
export const CircleIcon = createIcon(CircleIconRaw);
export const ChevronDownIcon = createIcon(ChevronDownIconRaw);
export const ChevronRightIcon = createIcon(ChevronRightIconRaw);
export const Clock01Icon = createIcon(Clock01IconRaw);
export const CloudIcon = createIcon(CloudIconRaw);
export const CodeIcon = createIcon(CodeIconRaw);
export const ComponentIcon = createIcon(ComponentIconRaw);
export const Copy01Icon = createIcon(Copy01IconRaw);
export const CreditCardIcon = createIcon(CreditCardIconRaw);
export const CubeIcon = createIcon(CubeIconRaw);
export const Cursor01Icon = createIcon(Cursor01IconRaw);
export const DashboardSquare01Icon = createIcon(DashboardSquare01IconRaw);
export const DatabaseIcon = createIcon(DatabaseIconRaw);
export const DeliveryBox01Icon = createIcon(DeliveryBox01IconRaw);
export const Diamond01Icon = createIcon(Diamond01IconRaw);
export const FeatherIcon = createIcon(FeatherIconRaw);
export const FileCodeIcon = createIcon(FileCodeIconRaw);
export const FilterIcon = createIcon(FilterIconRaw);
export const FireIcon = createIcon(FireIconRaw);
export const Folder01Icon = createIcon(Folder01IconRaw);
export const GithubIcon = createIcon(GithubIconRaw);
export const GlobeIcon = createIcon(GlobeIconRaw);
export const GridIcon = createIcon(GridIconRaw);
export const Home01Icon = createIcon(Home01IconRaw);
export const Home06Icon = createIcon(Home06IconRaw);
export const Invoice01Icon = createIcon(Invoice01IconRaw);
export const LaptopIcon = createIcon(LaptopIconRaw);
export const Layers02Icon = createIcon(Layers02IconRaw);
export const Mail01Icon = createIcon(Mail01IconRaw);
export const Menu01Icon = createIcon(Menu01IconRaw);
export const MobileNavigator01Icon = createIcon(MobileNavigator01IconRaw);
export const Money01Icon = createIcon(Money01IconRaw);
export const MoneyBag01Icon = createIcon(MoneyBag01IconRaw);
export const Moon02Icon = createIcon(Moon02IconRaw);
export const MoreHorizontalIcon = createIcon(MoreHorizontalIconRaw);
export const NoteIcon = createIcon(NoteIconRaw);
export const PackageIcon = createIcon(PackageIconRaw);
export const PaintBrush01Icon = createIcon(PaintBrush01IconRaw);
export const PenTool02Icon = createIcon(PenTool02IconRaw);
export const PuzzleIcon = createIcon(PuzzleIconRaw);
export const Rocket01Icon = createIcon(Rocket01IconRaw);
export const SchoolIcon = createIcon(SchoolIconRaw);
export const Search01Icon = createIcon(Search01IconRaw);
export const SecurityLockIcon = createIcon(SecurityLockIconRaw);
export const Settings01Icon = createIcon(Settings01IconRaw);
export const ShoppingBag01Icon = createIcon(ShoppingBag01IconRaw);
export const Smartphone01Icon = createIcon(Smartphone01IconRaw);
export const SparklesIcon = createIcon(SparklesIconRaw);
export const Store01Icon = createIcon(Store01IconRaw);
export const Sun03Icon = createIcon(Sun03IconRaw);
export const Tag01Icon = createIcon(Tag01IconRaw);
export const TerminalIcon = createIcon(TerminalIconRaw);
export const TranslateIcon = createIcon(TranslateIconRaw);
export const UserIcon = createIcon(UserIconRaw);
export const Wallet01Icon = createIcon(Wallet01IconRaw);
export const WorkHistoryIcon = createIcon(WorkHistoryIconRaw);
export const Wrench01Icon = createIcon(Wrench01IconRaw);
