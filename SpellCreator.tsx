import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';
import { SettingsContext } from './SettingsContext';
import { useAuth } from './AuthContext';
import { UserData } from './UserData';
const SpellCreator: React.FC = ({ navigation }) => {
  const { fontSize, scaleFactor } = useContext(SettingsContext);
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
const { ipv4 } = useContext(UserData);
const { token } = useAuth();
  const [spell, setSpell] = useState({
    name: '',
    description: '',
    atHigherDescription: '',
    level: 'cantrip',
    castingTime: '',
    duration: '',
    school: '',
    range: ''
  });

  const [castingTime, setCastingTime] = useState('');
  const [castingAmount, setCastingAmount] = useState('');
  const [level, setLevel] = useState('cantrip');
  const [school, setSchool] = useState('');
  const [verbal, setVerbal] = useState(false);
  const [somatic, setSomatic] = useState(false);
  const [material, setMaterial] = useState(false);
  const [materialDescription, setMaterialDescription] = useState('');
  const [range, setRange] = useState('');
  const [areaType, setAreaType] = useState('none');
  const [duration, setDuration] = useState('');
  const [durationAmount, setDurationAmount] = useState('');
  const [areaDurationAmount, setAreaDurationAmount] = useState('');
  const [concentration, setConcentration] = useState(false);
  const [showMaterialInput, setShowMaterialInput] = useState(false);
  const [amount, setAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [showRangeInput, setShowRangeInput] = useState(false);

  const handleInputChange = (field, value) => {
    setSpell((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveSpell = () => {
    addNewSpell();
  };
const addNewSpell = async () => {
  const components = [];

  if (verbal) components.push('V');
  if (somatic) components.push('S');
  if (material && materialDescription) components.push(materialDescription);

  try {
    const requestBody = {
      token: token,
      name: spell.name,
      description: spell.description,
      level: level,
      castingTime: castingTime,
      duration: durationAmount ? `${durationAmount} ${duration}` : duration,
      components: components,
      atHigherLevels: spell.atHigherDescription,
      school: school,
      range: range,
    };

    console.log(requestBody);

    const response = await fetch(`http://${ipv4}:8000/spells/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('New Spell:', result);

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }


};
  return (
    <ImageBackground source={theme.background} style={styles.containerCreator}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style = {styles.containerSpellCreator}>
        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Name')}</Text>
            <TextInput
              style={[styles.inputSpellCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter Spell Name')}
              value={spell.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Level')}</Text>
            <Picker
              selectedValue={level}
              style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setLevel(value)}
            >
              <Picker.Item label={t('Cantrip')} value="cantrip" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
            </Picker>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Casting Time')}</Text>
            <Picker
              selectedValue={castingTime}
            style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => {
                setCastingTime(value);
                setShowAmountInput(value === 'minutes' || value === 'hours');
              }}
            >
              <Picker.Item label={t('Action')} value="action" />
              <Picker.Item label={t('Bonus Action')} value="bonus_action" />
              <Picker.Item label={t('Reaction')} value="reaction" />
              <Picker.Item label={t('Minutes')} value="minutes" />
              <Picker.Item label={t('Hours')} value="hours" />
            </Picker>

          </View>

          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('School')}</Text>
            <Picker
              selectedValue={school}
              style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => setSchool(value)}
            >
              <Picker.Item label={t('Evocation')} value="evocation" />
              <Picker.Item label={t('Abjuration')} value="abjuration" />
              <Picker.Item label={t('Conjuration')} value="conjuration" />
              <Picker.Item label={t('Divination')} value="divination" />
              <Picker.Item label={t('Enchantment')} value="enchantment" />
              <Picker.Item label={t('Illusion')} value="illusion" />
              <Picker.Item label={t('Necromancy')} value="necromancy" />
              <Picker.Item label={t('Transmutation')} value="transmutation" />
            </Picker>
          </View>
        </View>

          <View style={styles.column}>
            {showAmountInput && (
            <TextInput
              style={[styles.inputSpellCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter amount')}
              value={amount}
              onChangeText={(text) => {
                const validatedText = text.replace(/[^0-9]/g, '');
                setAmount(validatedText);
              }}
              keyboardType="numeric"
            />
            )}
          </View>

        <View style={styles.rowContainerA}>
          <Text style={[styles.labelCheck, { fontSize: fontSize, color: theme.textColor }]}>{t('Components')}:</Text>
          <CheckBox
            value={verbal}
            onValueChange={setVerbal}
                tintColors={{
                  true: theme.checkboxActive || '#4caf50',
                  false: theme.checkboxInactive || '#f44336',
                }}
          />
          <Text style={[styles.labelCheck, { fontSize: fontSize, color: theme.textColor }]}>{t('Verbal')}</Text>

          <CheckBox
            value={somatic}
            onValueChange={setSomatic}
                tintColors={{
                  true: theme.checkboxActive || '#4caf50',
                  false: theme.checkboxInactive || '#f44336',
                }}
          />
          <Text style={[styles.labelCheck, { fontSize: fontSize, color: theme.textColor }]}>{t('Somatic')}</Text>
        </View>
        <View style={styles.rowContainerA}>
          <CheckBox
            value={material}
            onValueChange={(value) => {
              setMaterial(value);
              setShowMaterialInput(value);
            }}
                tintColors={{
                  true: theme.checkboxActive || '#4caf50',
                  false: theme.checkboxInactive || '#f44336',
                }}
          />
          <Text style={[styles.labelCheck, { fontSize: fontSize, color: theme.textColor }]}>{t('Material')}</Text>
        </View>

          <View style={styles.column}>
          {showMaterialInput && (
            <TextInput
              style={[styles.inputSpellCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter Material')}
              value={materialDescription}
              onChangeText={setMaterialDescription}
            />
          )}
          </View>

        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={[styles.labelItemCreAB, { fontSize: fontSize, color: theme.textColor }]}>{t('Duration')}</Text>
            <Picker
              selectedValue={duration}
              style={[styles.pickerMagicItemCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}
              onValueChange={(value) => {
                setDuration(value);
                setShowDurationInput(value === 'minutes' || value === 'hours');
              }}
            >
              <Picker.Item label={t('Instantaneous')} value="instantaneous" />
              <Picker.Item label={t('Concentration')} value="concentration" />
              <Picker.Item label={t('Minutes')} value="minutes" />
              <Picker.Item label={t('Hours')} value="hours" />
            </Picker>

          </View>
        </View>
          <View style={styles.rowContainer}>

          <CheckBox
            value={concentration}
            onValueChange={setConcentration}
                tintColors={{
                  true: theme.checkboxActive || '#4caf50',
                  false: theme.checkboxInactive || '#f44336',
                }}
          />
          <Text style={[styles.labelCheck, { fontSize: fontSize, color: theme.textColor }]}>{t('Is Concentration?')}</Text>
        </View>

          <View style={styles.column}>
            {showDurationInput && (
                <TextInput
                  style={[styles.inputSpellCreator, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
                  placeholder={t('Enter duration amount')}
                  value={durationAmount}
                  onChangeText={(text) => {
                    const validatedText = text.replace(/[^0-9]/g, '');
                    setDurationAmount(validatedText);
                  }}
                  keyboardType="numeric"
                />
            )}
        </View>

        <View style={styles.rowContainer}>


          <View style={styles.column}>
            <Text style={[styles.labelItemCre, { fontSize: fontSize, color: theme.textColor }]}>{t('Range')}</Text>
            <TextInput
              style={[styles.inputSpellCreatorA, { height: 50 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              placeholder={t('Enter range')}
              value={range}
              onChangeText={(text) => {

                setRange(text);
              }}
            />
          </View>

        </View>

        <View style={styles.centeredBlockDescription}>
          <View style={styles.centeredBlockMagicItemCont}>
            <Text style={[styles.labelMagicItemCreA, { fontSize: fontSize, color: theme.textColor }]}>{t('Spell description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 100 * scaleFactor, width: 300 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              multiline
              placeholder={t('Enter spell description')}
              value={spell.SpellDescription}
              onChangeText={(text) => handleInputChange('SpellDescription', text)}
            />
          </View>

          <View style={styles.centeredBlockA}>
            <Text style={[styles.labelMagicItemCreA, { fontSize: fontSize, color: theme.textColor }]}>{t('Attunement description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { width: 300 * scaleFactor, height: 100 * scaleFactor, fontSize: fontSize, padding: 10 * scaleFactor }]}
              multiline
              placeholder={t('Enter at higher levels description')}
              value={spell.atHigherDescription}
              onChangeText={(text) => handleInputChange('atHigherDescription', text)}
            />
          </View>
        </View>
       </View>
      </ScrollView>

        <View style={[styles.saveButton, { marginBottom: 10 * scaleFactor }]}>
          <TouchableOpacity style={[styles.buttonMonstrum, { height: 50 * scaleFactor, width: 200 * scaleFactor }]} onPress={saveSpell}>
            <ImageBackground source={theme.backgroundButton} style={[styles.buttonBackground, { height: 50 * scaleFactor, width: 200 * scaleFactor }]}>
              <Text style={[styles.GoBackText, { fontSize: fontSize, color: theme.fontColor }]}>{t('Save Spell')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default SpellCreator;