import {Ionicons} from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>['name'];
export type Props = {
    icon: IconName,
    text: string,
}

export type SettingsProps = {
    icon: IconName,
    label: string,
    onPress?: () => void,
    color?: string,
    rightElement?: React.ReactNode,
}