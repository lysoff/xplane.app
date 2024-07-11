import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import ToiletSvg from "@/assets/icons/toilet.svg";
import CandySvg from "@/assets/icons/candy.svg";
import SmokingSvg from "@/assets/icons/smoking.svg";
import PhoneSvg from "@/assets/icons/phone.svg";
import FocusSvg from "@/assets/icons/focus.svg";
import { SvgProps } from "react-native-svg";

export const IconNames = [
  "focus",
  "phone",
  "smoking",
  "sugar",
  "toilet phone",
] as const;

export type FieldType = (typeof IconNames)[number];

export const Icons: Record<FieldType, React.FC<SvgProps>> = {
  focus: FocusSvg,
  "toilet phone": ToiletSvg,
  sugar: CandySvg,
  smoking: SmokingSvg,
  phone: PhoneSvg,
};

export { Feather, MaterialCommunityIcons, SimpleLineIcons };
