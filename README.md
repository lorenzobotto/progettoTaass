# progettoTaass
Sviluppo del sito 'Petcare', servizio pet sitting, in React, React Native, Spring, Docker e Kubernetes - 2022.

## Descrizione progetto

Sviluppo di un sito di servizio pet sitting (cani o gatti) in React, con la propria applicazione (limitata) in React Native.
Per sviluppare il Backend è stato utilizzato il framework Spring, Docker, Kubernetes e PostgreSQL.

Ci sono tre tipologie di registrazioni:
- struttura: viene registrata la struttura di accoglienza, con una serie di informazioni, così che può ricevere delle prenotazioni dagli utenti;
- pet sitter: viene registrato/a il/la pet sitter, con una serie di informazioni, così che può ricevere delle prenotazioni dagli utenti;
- utente: viene registrato l'utente in modo che può effettuare prenotazioni presso la struttura o il/la pet sitter.

Il sito prevede le seguenti caratteristiche:
- per ogni registrazione, si può decidere se registrarsi tramite email oppure tramite Google o Facebook (registrazioni rapide);
- si può effettuare il login tramite email e password, oppure con Google o Facebook (accessi rapidi) se si è registrati tramite quest'ultimi;
- si può prenotare, se si è un utente, presso una struttura di accoglienza o pet sitter scegliendo la città dove si vuole prenotare e il periodo di date. Successivamente, verrà visualizzata una mappa con tutte le strutture e i pet sitter tramite segnaposti, che se cliccati mostrano le informazioni sulla struttura o sul pet sitter. Effettuata la scelta, vengono richieste informazioni aggiuntive ed infine si sceglie se pagare con PayPal oppure in contanti;
- nella sezione privata dell'utente, si può modificare le informazioni del profilo (inserite nella fase di registrazione) e si può ricontrollare tutte le prenotazioni con la posssibilità di annullarla (se con PayPal effettuerà un rimborso) entro una data limite;
- nella sezione privata della struttura o del petsitter, oltre a modificare il profilo come per l'utente, si possono vedere le prenotazioni effettuate presso di loro.

Sono state utilizzate diverse API per la realizzazione del sito:
- PayPal API;
- Facebook Login API;
- Google Login API;
- Google Maps API;
- Google Geocode API;
- Google Autocomplete API.

Il backend è formato da quattro microservizi (con API Gateway ed Eureka Server):
- microservizio di autenticazione: è un microservizio che garantisce agli utenti l’autenticazione semplice con email ed inoltre con Google e Facebook;
- microservizio degli utenti: è un microservizio per la gestione delle informazioni degli utenti;
- microservizio della mappa dei risultati: è un microservizio che raccoglie le informazioni sugli indirizzi da aggiungere come segnaposti nella mappa di Google;
- microservizio delle prenotazioni: è un microservizio che gestisce tutte le prenotazioni verso petsitter e strutture da parte degli utenti.

Design Backend:

![Design Backend](http://drive.google.com/uc?export=view&id=1mOuiKCl-tDPsbnBnAaUSBN7PTOdSViwr)

**Disclaimer: Tutti i dati inseriti nel database da me sono dati di prova, talvolta casuali e talvolta reali a scopo di prova. Non utilizzare alcun dato per nessun scopo particolare. Non mi assumo nessuna responsabilità.**

## Website

### Frontend

Il Backend deve essere inizializzato prima di utilizzare il Frontend.
Da riga di comando, dalla cartella principale, spostarsi nella cartella del Frontend con:
```
cd Website\Frontend 
```
Si installano i moduli necessari e si inizializza il sito:
```
yarn install
yarn start
```
Una volta avviato il Frontend, aprire dal browser:
```
https://localhost:3000
```
**ATTENZIONE!** Per utilizzare le varie API bisogna creare le chiavi e modificare i files .env: vedere [**Generazione chiavi API e Clients**](#generazione-chiavi-api-e-clients). Una volta modificati i file .env è necessario chiudere il Frontend e rieseguire:
```
yarn start
```

### Backend

Da riga di comando, dalla cartella principale, spostarsi nella cartella del Backend con:
```
cd Website\Backend 
```
Per creare tutti i servizi e caricarli su Docker come immagini, avendo Docker Desktop installato ed avviato, eseguire il comando:
```
mvn clean install -DskipTests
```
Per eseguire le immagini dei servizi su Kubernetes, avere installato Kubernetes (io ho utilizzato Kubernetes di Docker Desktop) ed eseguire il comando:
```
kubectl apply -f kubernetes-services-deployments.yaml
```
Per eliminare tutti i servizi da Kubernetes, eseguire il comando:
```
kubectl delete -f kubernetes-services-deployments.yaml
```

Attendere che tutti i servizi vengano caricati correttamente (può richiedere alcuni minuti).

Una volta che tutti i servizi sono funzionanti, inserire nel database i tre ruoli necessari per il funzionamento del sito, una struttura di prova, un pet sitter di prova e un'utente andando su:
```
http://localhost:30001
```
Accedere con:
 - Email: admin@admin.com
 - Password: root

Aggiungere un nuovo server inserendo queste configurazioni:

Nella scheda "General":
 - Name: nome del server che si vuole

Nella scheda "Connection":
 - Host: postgresqldb
 - Port: 5432
 - Username: postgres
 - Password: postgres

Si avvia il server, si sceglie come Database "websitepetcare" e si apre il query editor di pgamin.
Successivamente si utilizza questo script:
```
-- Inserimento ruoli

INSERT INTO public.roles (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO public.roles (id, name) VALUES (2, 'ROLE_PETSITTER');
INSERT INTO public.roles (id, name) VALUES (3, 'ROLE_STRUCTURE');

-- Inserimento struttura, pet sitter ed utente di prova

INSERT INTO public.users (id, animali_da_accudire, cap, capienza, citta, cognome, email, indirizzo, nome, nome_struttura, password, prezzo, provider, telefono, username) VALUES (1, 'entrambi', '10149', 20, 'Torino', 'Rossi', 'struttura1@gmail.com', 'Via pessinetto 12', 'Mario', 'Struttura Prova Numero 1', '$2a$10$22lrwbqyu8FY0cZZaWKclOjD1PunH.xGuSWk0ChUaGP2dqdIjy6P.', 20.00, 'Local', '3334567890', 'struttura1');
INSERT INTO public.users (id, animali_da_accudire, cap, capienza, citta, cognome, email, indirizzo, nome, nome_struttura, password, prezzo, provider, telefono, username) VALUES (2, 'cani', '12051', NULL, 'Alba', 'Bianchi', 'petsitter1@gmail.com', 'Via maestra 12', 'Giorgio', NULL, '$2a$10$iGtKLMyEyYE3ShZhrwGlee31HusGEEoReCwAwNCXqGxo3k/C2NvDG', 15.00, 'Local', '3850387463', 'petsitter1');
INSERT INTO public.users (id, animali_da_accudire, cap, capienza, citta, cognome, email, indirizzo, nome, nome_struttura, password, prezzo, provider, telefono, username) VALUES (3, NULL, '10149', NULL, 'Torino', 'Verdi', 'cliente1@gmail.com', 'Strada Roma 1', 'Andrea', NULL, '$2a$10$l42p0Fdxtwo47dSf.vMtLOqripwxmW4T1cFDeiSQN5BL3x9Y7aE4C', NULL, 'Local', '3055830912', 'cliente1');
INSERT INTO public.giorni_lavoro (id, giorni_lavoro) VALUES (2, 'lunedi');
INSERT INTO public.giorni_lavoro (id, giorni_lavoro) VALUES (2, 'martedi');
INSERT INTO public.giorni_lavoro (id, giorni_lavoro) VALUES (2, 'mercoledi');
INSERT INTO public.giorni_lavoro (id, giorni_lavoro) VALUES (2, 'sabato');
INSERT INTO public.giorni_lavoro (id, giorni_lavoro) VALUES (2, 'domenica');
INSERT INTO public.giorni_lavoro (id, giorni_lavoro) VALUES (2, 'giovedi');
INSERT INTO public.user_roles (user_id, role_id) VALUES (1, 3);
INSERT INTO public.user_roles (user_id, role_id) VALUES (2, 2);
INSERT INTO public.user_roles (user_id, role_id) VALUES (3, 1);
```

Dati login di prova:
- struttura: 
    - username: struttura1
    - password: struttura1
- pet sitter:
    - username: petsitter1
    - password: petsitter1
- cliente:
    - username: cliente1
    - password: cliente1

## Applicazione

E' stato utilizzato Expo come piattaforma per sviluppare l'app, pertanto prima di proseguire bisogna:
1. creare un account su https://expo.dev/ ed effettuare il login;
2. nel menù a sinistra, creare un nuovo progetto tramite "Create Project";
3. inserire le informazioni del progetto a piacimento, ricordando di salvarsi il nome del progetto (Display Name) e lo slug del progetto, ed infine crearla;
4. modificare il file "app.json" (nella cartella "App") inserendo come "name" (sotto "expo") il valore del nome del progetto (Display Name) salvato precedentemente;
5. modificare il file "app.json" (nella cartella "App") inserendo come "slug" (sotto "expo") il valore dello slug salvato precedentemente;
6. modificare il file "app.json" (nella cartella "App") inserendo come "owner" il nome dell'account Expo precedentemente creato che contiene il progetto.

Installare un emulatore Android, preferibilmente con Android Studio (con Play Store e Android R), ed avviarlo prima di proseguire. Anche il Backend deve essere inizializzato prima di utilizzare l'applicazione.
Da riga di comando, per inizializzare l'applicazione, spostarsi sulla cartella dell'app con:
```
cd App 
```
Si installano i moduli necessari e si inizializza l'applicazione:
```
yarn install
yarn start
```
Dopo premere il pulsante "a" sulla tastiera nel terminale per aprire l'applicazione sull'emulatore.

**ATTENZIONE!** Per utilizzare le varie API bisogna creare le chiavi e modificare i files .env: vedere [**Generazione chiavi API e Clients**](#generazione-chiavi-api-e-clients). Una volta modificati i file .env è necessario chiudere l'app e rieseguire:
```
yarn start
```

**N.B.: Nel file "package.json" (dentro la cartella "App") sotto "scripts" il valore di "start" contiene "expo start -c" ed il "-c" significa che ad ogni avvio (comando "yarn start") pulisce la cache di Expo. Questo l'ho inserito perchè ho avuto problemi quando l'app era già stata inizializzata una prima volta e poi si andava a modificare di nuovo il file .env, ma in memoria l'app aveva i dati vecchi e non li aggiornava. In questo modo pulendo la cache ogni volta, aggiorna sempre i dati .env. Conviene, se si usa spesso il comando "yarn start", modificare il valore di "start" eliminando il "-c" perchè altrimenti pulirà la cache ad ogni comando "yarn start", il quale aumenta il tempo di esecuzione dell'app ed reinserire il "-c" solo quando necessario.**

## Generazione chiavi API e Clients

Per fare in modo che tutte le API funzionino correttamente bisogna modificare il file .env con le API richieste.
Qui di seguito spiegherò come andare a creare ogni singola API e come modificare il file .env. E' richiesto per Facebook Login API e Google Login API che sia stata già creata l'app su Expo in modo da inserire il nome dell'account e lo slug del progetto (vedere [**Applicazione**](#applicazione)).

**Facebook Login API:**
1. accedi al link https://developers.facebook.com/ (dopo aver creato un account sviluppatore) ed effettuare il login;
2. in alto, cliccare su "Le mie app" e successivamente su "Crea un'app";
3. scegliere come tipo di app "Azienda" e scegliere le altre informazioni dell'app come si preferisce;
4. creare l'app;
5. trovare tra i prodotti "Facebook Login" e selezionare su "Configura";
6. a sinistra, tra i prodotti, scegliere "Facebook Login" e "Impostazioni";
7. abilitare "Accedi con l'SDK JavaScript" nella sezione "URI di reindirizzamento OAuth validi";
8. aggiungere in "Domini consentiti per l'SDK JavaScript" il valore "https://localhost:3000/";
9. aggiungere in "URI di reindirizzamento OAuth validi" il valore "https://auth.expo.io/@my-username/my-project-slug" modificando:
    - "my-username" con il nome dell'account Expo che contiene il progetto (la "@" DEVE esserci!);
    - "my-project-slug" con lo slug del progetto.
   Salvare le modifiche.
10. andare poi in "Impostazioni" dell'app e scegliere "Di base" e copiarsi l'ID App;
11. nel file .env (sia nella cartella "App" e sia nella cartella "Website\Frontend") modificare "REACT_APP_FACEBOOK_CLIENT_KEY" con l'ID precedentemente copiato.

**Google Login API e Google API Key (dopo aver creato un progetto su https://console.cloud.google.com/):**
1. cercare e accedere alla categoria di configurazioni "Api e Servizi";
2. premere su "credenziali" e successivamente "Create Credentials", selezionando "ID Client OAuth" (è possibile che chieda di compilare la schermata consenso OAuth e nel caso compilarla inserendo le informazioni obbligatorie);
3. scegliere come tipo di applicazione "Applicazione web" e aggiungere il nome dell'app come si preferisce;
4. nella sezione "Origini JavaScript autorizzate" inserire il valore "https://localhost:3000";
5. aggiungere in "URI di reindirizzamento autorizzati" il valore "https://auth.expo.io/@my-username/my-project-slug" modificando:
    - "my-username" con il nome dell'account Expo che contiene il progetto;
    - "my-project-slug" con lo slug del progetto.
6. creare il client;
7. copiarsi l'ID Client;
8. nel file .env (sia nella cartella "App" e sia nella cartella "Website\Frontend") modificare "REACT_APP_GOOGLE_CLIENT_KEY" con l'ID precedentemente copiato;
9. creare un'altra credenziale selezionando "Chiave API" e copiarsi la chiave;
10. nel menù a sinistra selezionare "API e servizi abilitati" e successivamente selezionare "Abilita API e Servizi";
11. cercare, selezionare ed abilitare:
    - "Places API";
    - "Geocoding API";
    - "Maps JavaScript API".
12. nel file .env (nella cartella "Website\Frontend") modificare "REACT_APP_GOOGLE_API_KEY" con l'ID precedentemente copiato;

**PayPal API:**
1. accedi al link https://developer.paypal.com/home (dopo aver creato un account sviluppatore) ed effettuare il login;
2. dalla dashboard a sinistra, selezionare "My Apps & Credentials";
3. nella sezione "REST API apps" selezionare "Create App";
4. scegliere un nome per l'app ed il tipo "Merchant" e creare l'app;
5. copiarsi il "Client ID" e il "Secret" cliccando su "Show";
6. nel file .env (nella cartella "Website\Frontend") modificare "REACT_APP_PAYPAL_CLIENT" con l'ID Client precedentemente copiato;
7. nel file .env (nella cartella "Website\Frontend") modificare "REACT_APP_PAYPAL_SECRET" con il "Secret" precedentemente copiato.
8. se si volesse accedere alle Sandbox per controllare i movimenti:
    1. nel menu a sinistra, nella sezione "Sandbox", cliccare su "Accounts";
    2. ci saranno un profilo "Personal" ed un profilo "Business" (se non ci dovesse essere il profilo "Personal" crearlo, stessa cosa per il profilo "Business" ma ci dovrebbe essere perchè serve quando si crea l'app);
    3. per vedere i dati di accesso da inserire al link https://www.sandbox.paypal.com/signin, sotto "Manage Accounts" premere sui tre puntini e successivamente "View/edit account". Qui ci sarà l'"Email ID" e "System Generated Password" da usare per l'accesso alla Sandbox. Il "Personal" Account è molto importante in quanto sarà l'account che verrà usato nella schermata di pagamento sul sito, quando chiederà di accedere a PayPal (ovvero alla Sandbox) bisogna inserire i dati dell'account "Personal" che invierà il denaro all'account "Business". 

**Ricordarsi dopo aver modificato le chiavi nei file .env di TERMINARE e RIESEGUIRE l'App ed il Frontend tramite il comando:**
```
yarn start
``` 

## Video esecuzione del progetto

<a href="http://www.youtube.com/watch?feature=player_embedded&v=RoYkiI2uIF4
" rel="noopener" target="_blank"><img src="http://img.youtube.com/vi/RoYkiI2uIF4/0.jpg" 
alt="Esecuzione TAASS" width="400" border="10" /></a>

## Aggiornamento del 30/07/2022

Sono stati modificati i button di accesso Google nel Frontend in quanto è stato modificato il modo in cui si effettua l'accesso (Migration GIS) e di conseguenza anche lo stile dei button.