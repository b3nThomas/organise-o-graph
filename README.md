# organise-o-graph

**Chronologically organises, normalises and tags the file names of photos and videos.**  

>*Inspired by the birth of my daughter and the hundreds of pictures I keep getting sent on WhatsApp* 😂  
>*This app only supports .jpg and .mov files for now.*  

>_I've tried my best with this..._  
>_Wish I'd have known before that WhatsApp strips file metadata for security purposes..._ 😭  

`Before:`

    IMG_6515.jpg
    5d8cdc42-5525-400c-ae49-419841f224c9.JPG
    9758866b-aa57-4980-b3d5-285904d8abbf.MOV
    72cd9dd1-51fa-426b-b782-0cb15b0f9e6c.jpg
    SJY_2632.JPG

`After:`

    Babys_first_week_1.jpg
    Babys_first_week_2.jpg
    Babys_first_week_3.mov
    Babys_first_week_4.jpg
    Babys_first_week_5.jpg

## Usage

Download, install and build the app:

    $ git clone https://github.com/b3nThomas/organise-o-graph.git
    $ cd organise-o-graph
    $ npm install
    $ npm run build

`organise-o-graph` will copy all files from one destination to another while sorting chronologically, numbering and prepending your desired tag to each file.

    $ SRC="<path-to-source>" DEST="<path-to-destination>" TAG="<tag>" npm run organise

Sorted...literally 😎
