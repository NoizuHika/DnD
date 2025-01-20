creatorsMonFeatItemMagic

                <TextInput
                  style={styles.modalDetails}
                  value={`${t('Level: \n')} ${editedSpell.level}`}
                  onChangeText={(value) => handleEditChange('level', value)}
                  placeholder={t('Level')}
                  placeholderTextColor="#808080"
                  multiline
                />



   style registration forgot pass

roll dice style

DM change session

документация, Расширить больше вклад власны. То есть все тесты, все,
что касалось документация, проекта, имплементаций

тесты все,

перевод всего приложения. Оптимизация всех видоков


      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      onPress={() => navigation.goBack()}>