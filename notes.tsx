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

документация, Расширить больше вклад власны. То есть все тесты
тесты в документации, мануально как-то описать.

библиография в стиле
[2] What has caused the surge in popularity of Dungeons and Dragons? Blog na platformie tabletopdominion.com, 2023,
https://tabletopdominion.com/blogs/news/what-has-caused-the-surge-in-popularity-of-dungeons-and-dragons (dostęp 25.11.2024).

      <View style={[styles.GoBack, { height: 40 * scaleFactor, width: 90 * scaleFactor }]}>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <ImageBackground source={theme.backgroundButton} style={styles.buttonBackground}>
            <Text style={[styles.GoBackText, { fontSize: fontSize * 0.7 }]}>{t('Go_back')}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      style={[styles.pickerMonCre, { width: 200 * scaleFactor, transform: [{ scale: 1 * scaleFactor }] }]}

      onPress={() => navigation.goBack()}>

      textAlign: 'center',
      fontSize: 16,
      color: '#d6d6d6',
      width: '80%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 20,


Перевод


https://www.w3schools.com/css/css_examples.asp


style createCharacter 4
equipowana bron z inventory






9.
React Native – w naszym projekcie React Native stał się głównym narzędziem do tworzenia aplikacji mobilnej.
Dzięki niemu ta aplikacja moze byc tworzona zarówno na Androida, jak i iOS, korzystając z jednej bazy kodu.

TypeScript – użyłem TypeScript, aby kod był bardziej czytelny i łatwiejszy do utrzymania.
JavaScript byl uzyty do zapisywania np stylow aplikacji, oraz urochomienia npc metro, aktualizacji itd
Typowanie w TypeScript pomogalo unikać błędów już na etapie kompilacji
Z Bibliotek uzylem
i18next – dzięki tej bibliotece mogę dynamicznie zarządzać tłumaczeniami w aplikacji. Dzięki niej użytkownicy
mogą korzystać z aplikacji w różnych językach, co jest istotne, ponieważ aplikacja może być używana
przez graczy z różnych krajów.

Styled Components / Inline Styles – dzięki tym technologiom/bibliotekam mogłem dynamicznie dostosowywać
interfejs użytkownika. Na przykład, dla każdego urządzenia automatyczne ustawia sie inne wartości wielkości
czcionki, odstępów, obrazow , aby zapewnić optymalne doświadczenia użytkownika.

React Navigation – dzięki tej bibliotece zarządzam nawigacją w aplikacji. Dzięki niej uzytkownik moze
 płynnie przechodzić między ekranami i zapewnić użytkownikowi intuicyjny sposób poruszania się po aplikacji.

11.
W naszym projekcie przyjelismy podejście zwinne-przyrostowe (Agile).
Regularnie spotykałismy się z zespołem co tydzień w discrodzie lub na miescie, żeby omówić postępy aktualnego sprintu
 i zaplanować kolejne.
Dokumentacja była trzymana w chmurze, dzięki czemu mieliśmy do niej łatwy dostęp w każdej chwili.

Podzieliłismy projekt na dwa repozytoria na GitHubie: jedno dla
backendu ze sztuczną inteligencja, i drugie dla
 frontendowego kodu aplikacji mobilnej. Dzięki temu zarządzanie kodem było prostsze, a zmiany
 w obu częściach projektu mogły być łatwiej śledzone.

12.
Mamy 3 aktorow
Nowy użytkownik – w naszej aplikacji nowy użytkownik może łatwo
 się zarejestrować lub zalogować sie i po zalogowaniu sie moze wybrac jedną z 2 rol: Gracza albo Mistrza Gry

13.
Nowy uzytkownik ma mozliwosc do dwoch przypadkow uzycia
Rejestracja – nowi użytkownicy mogą szybko założyć konto, aby rozpocząć korzystanie z aplikacji.
Dzięki prostemu procesowi rejestracji mogą natychmiast zalogować się do swojego konta.
oraz
Logowanie – użytkownicy logują się na swoje konto, aby uzyskać dostęp do swoich postaci, sesji i
innych zasobów w aplikacji.

Gracz
ma pełny dostęp do swoich postaci i moze dołączać do różnych sesji.
Ma również możliwość tworzenia nowych postaci, zarządzania nimi i interakcji z innymi graczami w ramach sesji.
i Ma dostep do swoich notatek i mozliwosc wykonywania rzutow koscmi

Mistrz Gry
ma dostęp do narzędzi do tworzenia kampanii, zarządzania sesjami i przygotowywania materiałów
(np. notatki, obrazy). Co więcej, może przeglądać wielką bibliotekę DM, w której znajdzie zaklęcia,
 potworow, zasady oraz może tworzyć własne elementy homebrew, które będą używane w kampaniach.
Moze rowniez tworzyć i zarządzać potyczkami, w tym ustalać jakie potwory pojawią się w walce,
jakie będą miały statystyki i jak będzie wyglądać sama potyczka.

14
Na tym widoku prezentowane są 3 najważniejsze ekrany dla Gracza:

Podgląd obecnej sesji – Gracz ma wgląd w aktualnie trwającą sesję, w której bierze udział jego postać.
Może śledzić postęp wydarzeń, sprawdzać logi oraz jakie zadania stoją przed jego postacią.

Karta postaci – Gracz ma pełny dostęp do swojej postaci, w tym jej zaklęć, statystyk oraz ekwipunku.
Z poziomu karty może łatwo zarządzać swoimi umiejętnościami i przedmiotami, które ma przy sobie.

Wyniki rzutów kością – Gracz ma szybki dostęp do wyników swoich rzutów kością, co pozwala na śledzenie postępów
w grze i analizowanie, jak jego postać wykonuje akcje w trakcie sesji.

15
Na tym widoku prezentowane są 3 kluczowe ekrany dla Mistrza Gry (DM):

Podgląd obecnej kampanii – Mistrz Gry ma wgląd w kampanię, którą prowadzi. Widzi wszystkich uczestników sesji,
śledzi ich postępy i zarządza wydarzeniami, które mają miejsce w grze.

Prowadzenie potyczek – DM ma pełną kontrolę nad potyczkami między graczami a przeciwnikami.
Może ustawiać potwory, zarządzać inicjatywą oraz śledzić wynik walki w czasie rzeczywistym.

Dostęp do bibliotek – Mistrz Gry ma podgląd do bibliotek, które zawierają potwory,
zaklęcia, przedmioty i inne zasoby do wykorzystania podczas sesji. Ma również możliwość
sprawdzenia tworzonych przez graczy materiałów, takich jak homebrew, aby urozmaicić kampanię.

19
W naszym projekcie zajmowałem się głównie frontendem.
Na przykład, zaimplementowałem możliwość wyboru między jasnym a ciemnym motywem – opcja, którą możecie
zobaczyć na prezentowanym slajdzie. Dzięki temu użytkownicy mogą dostosować wygląd aplikacji do swoich preferencji.
Dodatkowo, wykorzystując bibliotekę i18next, dodałem tłumaczenia na cztery języki, co umożliwia płynne przełączanie
języka interfejsu bez konieczności restartowania aplikacji. Aby mieć pewność, że wszystko działa poprawnie,
przeprowadzałem manualne testy w Android Studio, uruchamiając aplikację na różnych wirtualnych urządzeniach.
Dzięki temu mogłem zadbać o to, aby interfejs prezentował się spójnie i intuicyjnie na każdym urządzeniu.
