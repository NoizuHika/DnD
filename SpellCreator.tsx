import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './theme/ThemeContext';
import styles from './styles';

const SpellCreator = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [spell, setSpell] = useState({
    name: '',
    SpellDescription: '',
    atHigherDescription: '',
    ClassesDescription: '',
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
    console.log('Spell saved:', spell);
  };

  return (
    <ImageBackground source={theme.background} style={styles.containerCreator}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.GoBack}>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
              <Text style={styles.GoBackText}>{t('Go_back')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={styles.label}>{t('Name')}</Text>
            <TextInput
              style={styles.inputSpellCreator}
              placeholder={t('Enter Spell Name')}
              value={spell.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>{t('Level')}</Text>
            <Picker
              selectedValue={level}
              style={styles.pickerMagicItemCre}
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
            <Text style={styles.label}>{t('Casting Time')}</Text>
            <Picker
              selectedValue={castingTime}
              style={styles.pickerMagicItemCre}
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
            <Text style={styles.label}>{t('Amount')}</Text>
            {showAmountInput && (
              <TextInput
                style={styles.inputSpellCreator}
                placeholder={t('Enter amount')}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>{t('School')}</Text>
            <Picker
              selectedValue={school}
              style={styles.pickerMagicItemCre}
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

        <View style={styles.rowContainer}>
          <Text style={styles.label}>{t('Components')}</Text>
          <CheckBox
            value={verbal}
            onValueChange={setVerbal}
            tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
          />
          <Text style={styles.label}>{t('Verbal')}</Text>

          <CheckBox
            value={somatic}
            onValueChange={setSomatic}
            tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
          />
          <Text style={styles.label}>{t('Somatic')}</Text>

          <CheckBox
            value={material}
            onValueChange={(value) => {
              setMaterial(value);
              setShowMaterialInput(value);
            }}
            tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
          />
          <Text style={styles.label}>{t('Material')}</Text>

          {showMaterialInput && (
            <TextInput
              style={styles.inputSpellCreator}
              placeholder={t('Enter Material')}
              value={materialDescription}
              onChangeText={setMaterialDescription}
            />
          )}
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={styles.label}>{t('Duration')}</Text>
            <Picker
              selectedValue={duration}
              style={styles.pickerMagicItemCre}
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
            {showDurationInput && (
              <TextInput
                style={styles.inputSpellCreator}
                placeholder={t('Enter duration amount')}
                value={durationAmount}
                onChangeText={setDurationAmount}
                keyboardType="numeric"
              />
            )}
          </View>

          <CheckBox
            value={concentration}
            onValueChange={setConcentration}
            tintColors={{ true: theme.checkboxActive, false: theme.checkboxInactive }}
          />
          <Text style={styles.label}>{t('Is Concentration?')}</Text>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={styles.label}>{t('Range')}</Text>
            <TextInput
              style={styles.inputSpellCreator}
              placeholder={t('Enter range')}
              value={range}
              onChangeText={setRange}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>{t('Area Type')}</Text>
            <Picker
              selectedValue={areaType}
              style={styles.pickerMagicItemCre}
              onValueChange={(value) => {
                setAreaType(value);
                setShowRangeInput(value === 'cone' || value === 'cylinder' || value === 'line' || value === 'sphere');
              }}
            >
              <Picker.Item label={t('None')} value="none" />
              <Picker.Item label={t('Cone')} value="cone" />
              <Picker.Item label={t('Cylinder')} value="cylinder" />
              <Picker.Item label={t('Line')} value="line" />
              <Picker.Item label={t('Sphere')} value="sphere" />
            </Picker>
            {showRangeInput && (
              <TextInput
                style={styles.inputSpellCreator}
                placeholder={t('Enter duration amount')}
                value={durationAmount}
                onChangeText={setDurationAmount}
                keyboardType="numeric"
              />
            )}
          </View>
        </View>

        <View style={styles.centeredBlockDescription}>
          <View style={styles.centeredBlockMagicItemCont}>
            <Text style={[styles.labelMagicItemCre, { color: theme.textColor }]}>{t('Magic item description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 100, width: 300, }]}
              multiline
              placeholder={t('Enter spell description')}
              value={spell.SpellDescription}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

          <View style={styles.centeredBlockA}>
            <Text style={[styles.labelMagicItemCre, { color: theme.textColor }]}>{t('Attunement description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { width: 300, }]}
              multiline
              placeholder={t('Enter at higher levels description')}
              value={spell.atHigherDescription}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

          <View style={styles.centeredBlockMagicItemCont}>
            <Text style={[styles.labelMagicItemCre, { color: theme.textColor }]}>{t('Magic item description')}</Text>
            <TextInput
              style={[styles.inputItemCreator, { height: 100, width: 300, }]}
              multiline
              placeholder={t('Enter classes description')}
              value={spell.ClassesDescription}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>
        </View>
      </ScrollView>

        <View style={styles.saveButton}>
          <TouchableOpacity style={styles.buttonMonstrum} onPress={saveSpell}>
            <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
              <Text style={styles.GoBackText}>{t('Save Spell')}</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default SpellCreator;