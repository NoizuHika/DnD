import React, { useContext } from 'react';
import { ImageBackground, Text, View, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const PlayerSessionDetails = () => {
    const route = useRoute();
    const { session } = route.params || {};
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);

    if (!session) {
        return (
            <View style={styles.container}>
                <Text style={[styles.titleSesDet, { color: theme.fontColor }]}>
                    {t('Session data not available')}
                </Text>
            </View>
        );
    }

    return (
        <ImageBackground source={theme.background} style={styles.container}>
            <Text style={[styles.titleSesDet, { color: theme.fontColor }]}>
                {session.name}
            </Text>
            <Text style={[styles.descriptionSesDet, { color: theme.fontColor }]}>
                {session.content}
            </Text>

            <View style={styles.sessionsListSesDet}>
                <Text style={[styles.sectionTitleSesDet, { color: theme.fontColor }]}>
                    {t('Sessions')}
                </Text>
                <ScrollView>
                    {session.sessions?.map((sess, index) => (
                        <View key={index} style={styles.sessionTabSesDet}>
                            <Text style={[styles.sessionTabTextSesDet, { color: theme.fontColor }]}>
                                {sess.name}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.notesContainerSesDet}>
                <Text style={[styles.sectionTitleSesDet, { color: theme.fontColor }]}>
                    {t('Notes')}
                </Text>
                {session.notes?.map((note, index) => (
                    <View key={index} style={styles.noteContainerSesDet}>
                        <Text style={[styles.noteTitleSesDet, { color: theme.fontColor }]}>
                            {note.title}
                        </Text>
                        <Text style={[styles.noteContentSesDet, { color: theme.fontColor }]}>
                            {note.content}
                        </Text>
                        {note.image && (
                            <Image source={note.image} style={styles.noteImageSesDet} />
                        )}
                    </View>
                ))}
            </View>
        </ImageBackground>
    );
};

export default PlayerSessionDetails;
