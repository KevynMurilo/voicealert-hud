# 🎙️ VoiceAlert HUD

> **Nunca mais leve reclamações por falar alto demais enquanto joga.**

O **VoiceAlert HUD** é um monitor de emissão acústica em tempo real desenvolvido especificamente para gamers que utilizam fone de ouvido e perdem a noção do volume da própria voz. O software monitora o microfone em segundo plano e emite alertas visuais e sonoros personalizáveis sempre que um limite de decibéis (dB) é ultrapassado.

## ✨ Funcionalidades

* **Monitoramento HUD:** Interface inspirada em hardware gamer com LEDs segmentados e display numérico estável (Tabular Nums).
* **Alertas Visuais (Flash):** A tela do monitor pisca em vermelho (configurável de 1 a 10 vezes) para garantir que você perceba o alerta mesmo concentrado no jogo.
* **Síntese Sonora:** 5 timbres exclusivos (Soft Pop, Cyber Chirp, Sonar, Glass Tap e Overload) gerados via Web Audio API.
* **Arquitetura Blindada:** Sistema de *cooldown* (supressão de spam) duplo para evitar notificações repetitivas.
* **Foco no Desempenho:** Baixíssimo consumo de CPU/RAM, sem minimizar ou interferir na performance dos seus jogos.
* **System Tray:** Funciona minimizado na bandeja do sistema, próximo ao relógio do Windows.
* **Auto-Start:** Opção para iniciar automaticamente junto com o Windows de forma silenciosa.

---

## 🚀 Tecnologias Utilizadas

* [Electron](https://www.electronjs.org/) - Framework para apps desktop nativos.
* [React](https://reactjs.org/) - Biblioteca para interfaces de usuário.
* [Tailwind CSS v4](https://tailwindcss.com/) - Estilização moderna e rápida.
* [Vite](https://vitejs.dev/) - Bundler de próxima geração.
* **Web Audio API** - Processamento e síntese de áudio em tempo real.

---

## 🛠️ Instalação para Desenvolvedores

Se você deseja clonar o projeto e rodar localmente:

1. **Clone o repositório:**
```bash
git clone https://github.com/kevynmurilo/voicealert-hud.git
cd voicealert-hud

```


2. **Instale as dependências:**
```bash
npm install

```


3. **Inicie em modo de desenvolvimento:**
```bash
npm run dev

```


4. **Gere o instalador (.exe):**
*Certifique-se de rodar o terminal como Administrador no Windows.*
```bash
npm run build:win

```



---

## 📖 Como Usar

1. Abra o **VoiceAlert**.
2. Vá em **Parâmetros do Sistema** (ícone de engrenagem).
3. Selecione o seu microfone de entrada.
4. Ajuste o **Limite de Ruído (Threshold)** enquanto fala:
* Fale normalmente: o volume deve ficar abaixo da linha branca.
* Grite/Fale alto: o volume deve ultrapassar a linha e ficar vermelho.


5. Clique em **Ativar Monitoramento** e volte para o seu jogo!

---

## 🎨 Estrutura do Projeto

O projeto segue uma arquitetura limpa e componentizada:

* `src/main/index.js`: Lógica do processo principal (Janela, Tray, Auto-start).
* `src/renderer/src/App.jsx`: Orquestrador de estado e visual global.
* `src/renderer/src/hooks/useAudioMonitor.js`: Hook customizado com lógica de processamento e síntese sonora.
* `src/renderer/src/components/`: Telas de Monitoramento e Configuração separadas.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.

---

**Desenvolvido por [Kevyn](https://www.google.com/search?q=https://github.com/kevynmurilo) 🚀**