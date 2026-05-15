import { AppRegistry } from 'react-native';
import App from './App'; // O 'A' aqui deve ser igual ao nome do arquivo
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (window.document) {
    AppRegistry.runApplication(appName, {
        initialProps: {},
        rootTag: document.getElementById('root'),
    });
}
