import { supabase } from '@/lib/supabase';
import { Button, Text } from 'react-native';
import { View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View>
      <Button
        title="Sign out"
        onPress={async () => await supabase.auth.signOut()}
      />
    </View>
  );
}
