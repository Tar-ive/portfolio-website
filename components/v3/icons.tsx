import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChampionIcon,
  File01Icon,
  GithubIcon,
  LabsIcon,
  Linkedin01Icon,
  LinkSquare02Icon,
  Location01Icon,
  Mail01Icon,
  Menu01Icon,
  Moon02Icon,
  Mortarboard01Icon,
  NewTwitterIcon,
  Sent02Icon,
  SourceCodeIcon,
  Sun03Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

/**
 * Hugeicons (free, stroke rounded) under the names the components already
 * use. Each takes a className for sizing, like the icons they replace.
 */

type IconProps = { className?: string; strokeWidth?: number };

function make(icon: IconSvgElement, name: string) {
  const Icon = ({ className, strokeWidth = 1.75 }: IconProps) => (
    <HugeiconsIcon
      icon={icon}
      className={className}
      strokeWidth={strokeWidth}
      color="currentColor"
      aria-hidden
    />
  );
  Icon.displayName = name;
  return Icon;
}

export const ArrowRight = make(ArrowRight02Icon, "ArrowRight");
export const ArrowUpRight = make(ArrowUpRight01Icon, "ArrowUpRight");
export const ChevronLeft = make(ArrowLeft01Icon, "ChevronLeft");
export const ChevronRight = make(ArrowRight01Icon, "ChevronRight");
export const Briefcase = make(Briefcase01Icon, "Briefcase");
export const Calendar = make(Calendar03Icon, "Calendar");
export const Code2 = make(SourceCodeIcon, "Code2");
export const ExternalLink = make(LinkSquare02Icon, "ExternalLink");
export const FileText = make(File01Icon, "FileText");
export const FlaskConical = make(LabsIcon, "FlaskConical");
export const Github = make(GithubIcon, "Github");
export const GraduationCap = make(Mortarboard01Icon, "GraduationCap");
export const Linkedin = make(Linkedin01Icon, "Linkedin");
export const Mail = make(Mail01Icon, "Mail");
export const MapPin = make(Location01Icon, "MapPin");
export const Menu = make(Menu01Icon, "Menu");
export const Moon = make(Moon02Icon, "Moon");
export const Send = make(Sent02Icon, "Send");
export const Sun = make(Sun03Icon, "Sun");
export const Trophy = make(ChampionIcon, "Trophy");
export const Twitter = make(NewTwitterIcon, "Twitter");
export const Users = make(UserGroupIcon, "Users");
export const X = make(Cancel01Icon, "X");
