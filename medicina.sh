#!/bin/csh
echo working with links...
casperjs get_links.js http://antares.iztacala.unam.mx/datos_anuario/index.php/anuario/principal/0/0/-/17/1/-/
echo working with pages...
casperjs get_data.js --area=medicina
echo write file and ending...