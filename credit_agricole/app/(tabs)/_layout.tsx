import React from 'react';

import { DynamicColorIOS} from "react-native";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs'

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <NativeTabs
      tintColor={'#009b9d'}
      >
          <NativeTabs.Trigger name="index">
              <Label>CRÉER</Label>
              <Icon sf={"plus.app"}/>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="carte">
              <Label>TROUVER</Label>
              <Icon sf={"map"}/>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="actus">
              <Label>ACTUS</Label>
              <Icon sf={"newspaper"}/>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="settings">
              <Label>PARAMÈTRES</Label>
              <Icon sf={"gear"}/>
          </NativeTabs.Trigger>
      </NativeTabs>
  );
}
