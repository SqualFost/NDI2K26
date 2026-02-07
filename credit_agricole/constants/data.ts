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

export type Projet = {
    id :number,
    nom : string,
    description : string,
    longitude : number,
    latitude : number,
    utilisateur_id:number,
    date_debut:Date,
    budget:number,
    categorie:string,
    localisation : string,
}