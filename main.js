const testFolder = './tests/';
const fs = require('fs');

fs.readdir("./sources/", (err, files) => {
    files.forEach(file => {
        console.log(typeof file);


        var par = fs.readFileSync(`./sources/${file}`).toString('utf-8');


        // Isolation
        par = par.match(/(\<h1\>)+\w[^]+(\<\/article\>)/g)[0];

        function rp(par, a, b) {

            while (par.includes(a)) {
                par = par.replace(a, b);
            }
            return par
        }




        //Gestion des listes
        mole = 0;
        count = 0;
        set = par.match(/<ol>(.*?)<\/ol>/gs);

        if (set) {
            for (i = 0; i < set.length; i++) {
                mole = par.search(/<ol>(.*?)<\/ol>/gs); //On chope la place dans le paragraphe
                temp = set[i]; //On prend l'élément
                par = par.replace(temp, " "); //On jarte du paragraphe
                temp = rp(temp, "<li>", " - ") //On bouge la prise
                temp = temp.replace("<ol>", "");
                temp = temp.replace("<\/ol>", "");
                par = [par.slice(0, mole), temp, par.slice(mole + 1)].join(''); //On réimplente la prise modifiée
            };
        };


        //Gestion des autres listes...
        mole = 0;
        count = 0;
        set = par.match(/^<div class=theo>(?:[^<]|<(?!\/div>))+?<\/ul>$/gm);

        if (set) {
            for (i = 0; i < set.length; i++) {
                mole = par.search(/^<div class=theo>(?:[^<]|<(?!\/div>))+?<\/ul>$/gm); //On chope la place dans le paragraphe
                temp = set[i]; //On prend l'élément
                par = par.replace(temp, " "); //On jarte du paragraphe
                temp = rp(temp, "<li>", " - ") //On bouge la prise
                temp = temp.replace("<ul>", "");
                temp = temp.replace("<\/ul>", "");
                par = [par.slice(0, mole), temp, par.slice(mole + 1)].join(''); //On réimplente la prise modifiée
            };
        };

        //Formatage
        par = par.replace(/<\s*div class="inner"[^>]*>(.*?)<\s*\/\s*div>/g, '');

        par = rp(par, '<li>', '');
        par = rp(par, '<h1>', '');
        par = rp(par, '</h1>', '\n\n');
        par = rp(par, '<ul>', '');
        par = rp(par, '</ul>', '');
        par = rp(par, '</article>', '');
        par = rp(par, '&nbsp;', '');
        par = rp(par, '<div class=liste>', '');
        par = rp(par, '<div class=titrepartie>', '');
        par = rp(par, '<div>', '');
        par = rp(par, '</div>', '');
        par = rp(par, '<div class=theo>', '');
        par = par.replace(/<\s*button[^>]*>(.*?)<\s*\/\s*button>/g, '');


        //Changement des doubles dollars
        var count = 0;

        while (par.includes("$$")) {
            if (count % 2 === 0) {
                par = par.replace("$$", "\\(");
            } else {
                par = par.replace("$$", "\\)");
            };
            count += 1;
        };


        //Changement des dollars
        var count = 0;

        while (par.includes("$")) {
            if (count % 2 === 0) {
                par = par.replace("$", "\\(");
            } else {
                par = par.replace("$", "\\)");
            };
            count += 1;
        };


        //Changement du gras des defs
        mole = 0;
        count = 0;
        set = par.match(/(<span class=rougedico>)(.*?)(<\/span>)/g);

        if (set) {
            for (i = 0; i < set.length; i++) {
                mole = par.search(/(<span class=rougedico>)(.*?)(<\/span>)/g);
                temp = set[i];
                par = par.replace(temp, " ");
                temp = temp.replace("<span class=rougedico>", "");
                temp = temp.replace("<\/span>", "");
                par = [par.slice(0, mole), "<b>", temp, "</b>", par.slice(mole + 1)].join('');
            };
        };


        //Changement du gras des props
        mole = 0;
        count = 0;
        set = par.match(/(<span class=grastheo>)+\w[^\>]+(<\/span>)/g);

        if (set) {
            for (i = 0; i < set.length; i++) {
                mole = par.search(/(<span class=grastheo>)+\w[^\>]+(<\/span>)/g);
                temp = set[i];
                par = par.replace(temp, " ");
                temp = temp.replace("<span class=grastheo>", "");
                temp = temp.replace("<\/span>", "");
                par = [par.slice(0, mole), "<b>", temp, "</b>", par.slice(mole + 1)].join('');
            };
        };


        //Changement du gras des théorèmes
        mole = 0;
        count = 0;
        set = par.match(/(<span class=theo>)+\w[^\>]+(<\/span>)/g);

        if (set) {
            for (i = 0; i < set.length; i++) {
                mole = par.search(/(<span class=theo>)+\w[^\>]+(<\/span>)/g);
                temp = set[i];
                par = par.replace(temp, " ");
                temp = temp.replace("<span class=theo>", "");
                temp = temp.replace("<\/span>", "");
                par = [par.slice(0, mole), "<b>", temp, "</b>", par.slice(mole + 1)].join('');
            };
        };


        //Quelques autres remplacements
        par = par.replace(/:\r\n/gm, ':');
        par = par.replace(/}(?! )/g, "} ")
        par = par.replace(/=/g, "=\\) \\(")
        par = par.replace(/\n\r\n\r/gm, "\n");
        par = par.replace(/\.(?!\\)/gm, ".\n");
        par = par.replace(/\.\\\)/gm, ".\\)\n");


        //Écriture dans le fichier
        fs.writeFile(`./results/${file}`, par, (err) => {
            if (err) throw err;
        });


        console.log(`Transformation de ${file} effectuée !`);
    });
});