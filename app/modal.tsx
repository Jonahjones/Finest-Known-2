import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/ui/Button';
import { colors, typography, spacing } from '../src/design/tokens';

export default function ModalScreen() {
  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Modal</Text>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.text}>This is a modal screen.</Text>
          <Button
            title="Close Modal"
            onPress={() => {}}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  text: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing['2xl'],
  },
  
  button: {
    minWidth: 200,
  },
});
