const express = require('express');
const app = express();
var whiskers = require('whiskers');
var path = require('path');

app.engine('.html', whiskers.__express);
app.set('views', __dirname+'/views');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index.html', {
        projects: [
            {
                name: "IDE",
                desc: "Projeto simples que é feito para escrever codigos e mostra-los em tempo real"
            },
            {
                name: "Discord Bot",
                desc: "Projeto na qual usa de uma API do Discord, e cria um robo que faz diversas coisas"
            }
        ]
    })
})

app.get('/ide', (req, res) => {
  res.render('ide.html')
});

app.listen(3000, () => {
  console.log('[[Server] Online in https://atomic.legumii.repl.co with 3000 PORT ]');
});
