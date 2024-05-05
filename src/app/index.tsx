import { ActivityIndicator, View } from 'react-native';
import { Link, Redirect } from 'expo-router';
import Button from '@/components/Button';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function index() {
  const { session, sessionFetching, isAdmin } = useAuth();

  if (sessionFetching) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={'/sign-in'} />;
  }

  if (!isAdmin) {
    return <Redirect href={'/(user)'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link
        href="/(user)"
        asChild
      >
        <Button text="User" />
      </Link>
      <Link
        href="/(admin)"
        asChild
      >
        <Button text="Admin" />
      </Link>

      <Button
        onPress={() => supabase.auth.signOut()}
        text="Sign out"
      />
    </View>
  );
}
