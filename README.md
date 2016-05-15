Frontend client for [Growduino-firmware](https://github.com/AxTheB/Growduino-firmware/)

### Implementation specifics
* FAT filesystem - filenames must be in 8.3 format.
* Parallel requests are not recommended.


Instalace

Requirements - NodeJS, Grunt, Bower

    Nainstalovat GIT pomoci:
    sudo apt-get install git
    Naklonovat si repository pomoci:
    git clone https://github.com/romanicak/growduino-client
    Sup do adresare:
    cd growduino-client
    Nainstalovat NPM pomoci:
    sudo apt-get install npm
    Nainstalovat NodeJS zavislosti (pro dev a pripadne pro proxy):
    npm install
    Nainstalovat Bower pomoci:
    sudo npm install -g bower
    Dostat Node na spravnou cestu, on uz se totiz jmenuje NodeJS:
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    Bower pak stahne vsechny zavislosti samotne webove aplikace:
    bower install
    Nainstalovat Grunt pomoci:
    sudo npm install -g grunt-cli
    -- Ted je vse pripraveno pro build, nasledujici je potreba pro editaci a testy--
    Spustit proxy pomoci:
    node proxy
    V prohlizeci by se ted pod adresou localhost:8000 mel zobrazit lokalni web co si taha data ze skutecnyho Growduina
    Stahnout editor, treba http://www.sublimetext.com/ (rozbalit a instalovat jde ve voknech) spustit z terminalu pomoci:
    subl
    Po editaci (staci tam pretahovat co chci editovat) se buildi pomoci:
    grunt dist
    (kde dist je parametr jakou distribuci buildit, pro rybare je to distfish)
