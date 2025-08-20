import { WebPartContext } from "@microsoft/sp-webpart-base";
import { NavigateFunction } from "react-router-dom";

export interface IRecruitmentProps {
 sp: any;
  context: WebPartContext;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  description: string;
  navigateto?: NavigateFunction; // Optional for non-router components
}
