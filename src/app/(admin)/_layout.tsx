import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useAuth } from '@/providers/AuthProvider';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return (
    <FontAwesome
      size={20}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect href={'/'} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.background,
				tabBarInactiveTintColor: 'gainsboro',
        tabBarStyle: {
          backgroundColor: Colors.light.tint,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="cutlery"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
					headerShown: false,
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="list"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
