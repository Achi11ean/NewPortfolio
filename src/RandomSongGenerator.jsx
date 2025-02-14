import React, { useState } from "react";
import { motion } from "framer-motion";

const songs = [
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Sweet Caroline", artist: "Neil Diamond" },
  { title: "Sweet Caroline", artist: "Neil Diamond" },
  { title: "Don't Stop Believin'", artist: "Journey" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi" },
  { title: "I Will Survive", artist: "Gloria Gaynor" },
  { title: "Take Me Home, Country Roads", artist: "John Denver" },
  { title: "Dancing Queen", artist: "ABBA" },
  { title: "Billie Jean", artist: "Michael Jackson" },
  { title: "Like a Prayer", artist: "Madonna" },
  { title: "Rolling in the Deep", artist: "Adele" },
  { title: "The Climb", artist: "Miley Cyrus" },
  { title: "Man! I Feel Like a Woman!", artist: "Shania Twain" },
  { title: "Picture", artist: "Sheryl Crow & Kid Rock" },
  { title: "Before He Cheats", artist: "Carrie Underwood" },
  { title: "Summer Nights", artist: "John Travolta & Olivia Newton-John" },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston" },
{ title: "You Shook Me All Night Long", artist: "AC/DC" },
{ title: "Bye Bye Bye", artist: "NSYNC" },
{ title: "Wannabe", artist: "Spice Girls" },
{ title: "It's My Life", artist: "Bon Jovi" },
{ title: "Oops!... I Did It Again", artist: "Britney Spears" },
{ title: "Love Song", artist: "Sara Bareilles" },
{ title: "Stand by Me", artist: "Ben E. King" },
{ title: "Hey Jude", artist: "The Beatles" },
{ title: "Jolene", artist: "Dolly Parton" },
{ title: "Take On Me", artist: "a-ha" },
{ title: "I Want It That Way", artist: "Backstreet Boys" },
{ title: "Superstition", artist: "Stevie Wonder" },
{ title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
{ title: "Shake It Off", artist: "Taylor Swift" },
{ title: "All the Small Things", artist: "Blink-182" },
{ title: "Tennessee Whiskey", artist: "Chris Stapleton" },
{ title: "My Way", artist: "Frank Sinatra" },
{ title: "Fly Me to the Moon", artist: "Frank Sinatra" },
{ title: "New York, New York", artist: "Frank Sinatra" },
{ title: "Folsom Prison Blues", artist: "Johnny Cash" },
{ title: "Ring of Fire", artist: "Johnny Cash" },
{ title: "Jackson", artist: "Johnny Cash" },
{ title: "Tainted Love", artist: "Soft Cell" },
{ title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics" },
{ title: "September", artist: "Earth, Wind & Fire" },
{ title: "Walking on Sunshine", artist: "Katrina and the Waves" },
{ title: "You're Beautiful", artist: "James Blunt" },
{ title: "I Don't Want to Miss a Thing", artist: "Aerosmith" },
{ title: "Come Sail Away", artist: "Styx" },
  { title: "Black Velvet", artist: "Alannah Myles" },
  { title: "Friends In Low Places", artist: "Garth Brooks" },
  { title: "Santeria", artist: "Sublime" },
  { title: "Love Shack", artist: "The B-52's" },
  { title: "I Love Rock and Roll", artist: "Joan Jett & The Blackhearts" },
  { title: "You Oughta Know", artist: "Alanis Morissette" },
  { title: "Wanted Dead Or Alive", artist: "Bon Jovi" },
  { title: "Redneck Woman", artist: "Gretchen Wilson" },
  { title: "Baby Got Back", artist: "Sir Mix-A-Lot" },
  { title: "Hit Me With Your Best Shot", artist: "Pat Benatar" },
  { title: "What's Up", artist: "4 Non Blondes" },
  { title: "Killing Me Softly", artist: "Fugees & Lauryn Hill" },
  { title: "Creep", artist: "Radiohead" },
  { title: "Plush", artist: "Stone Temple Pilots" },
  { title: "Folsom Prison Blues", artist: "Johnny Cash" },
  { title: "You Were Meant For Me", artist: "Jewel" },
  { title: "Total Eclipse Of The Heart", artist: "Bonnie Tyler" },
  { title: "Bring Me To Life", artist: "Evanescence" },
  { title: "Bitch", artist: "Meredith Brooks" },
  { title: "New York, New York", artist: "Frank Sinatra" },
  { title: "Margaritaville", artist: "Jimmy Buffett" },
  { title: "Me and Bobby McGee", artist: "Janis Joplin" },
  { title: "Under The Bridge", artist: "Red Hot Chili Peppers" },
  { title: "Something To Talk About", artist: "Bonnie Raitt" },
  { title: "I Touch Myself", artist: "Divinyls" },
  { title: "Like A Stone", artist: "Audioslave" },
  { title: "Criminal", artist: "Fiona Apple" },
  { title: "Crazy", artist: "Patsy Cline" },
  { title: "Say It Ain't So", artist: "Weezer" },
  { title: "Give Me One Reason", artist: "Tracy Chapman" },
  { title: "Shoop", artist: "Salt-N-Pepa" },
  { title: "At Last", artist: "Etta James" },
  { title: "Desperado", artist: "Eagles" },
  { title: "Black", artist: "Pearl Jam" },
  { title: "Piano Man", artist: "Billy Joel" },
  { title: "Zombie", artist: "The Cranberries" },
  { title: "I Believe In A Thing Called Love", artist: "The Darkness" },
  { title: "Heartbreaker", artist: "Pat Benatar" },
  { title: "Ring Of Fire", artist: "Johnny Cash" },
  { title: "Aenima", artist: "Tool" },
  { title: "Kryptonite", artist: "3 Doors Down" },
  { title: "Hotel California", artist: "Eagles" },
  { title: "The Humpty Dance", artist: "Digital Underground" },
  { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd" },
  { title: "Any Man Of Mine", artist: "Shania Twain" },
  { title: "Sin Wagon", artist: "Dixie Chicks" },
  { title: "You've Lost That Lovin' Feelin'", artist: "The Righteous Brothers" },
  { title: "My Humps", artist: "Black Eyed Peas" },
  { title: "Who Knew", artist: "Pink" },
  { title: "Son Of A Preacher Man", artist: "Dusty Springfield" },
  { title: "Paradise By The Dashboard Light", artist: "Meat Loaf" },
  { title: "I Want You To Want Me", artist: "Cheap Trick" },
  { title: "Dreams", artist: "Fleetwood Mac" },
  { title: "Let's Stay Together", artist: "Al Green" },
  { title: "Just A Girl", artist: "No Doubt" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
  { title: "Wonderwall", artist: "Oasis" },
  { title: "Like A Virgin", artist: "Madonna" },
  { title: "These Boots Are Made For Walkin'", artist: "Nancy Sinatra" },
  { title: "My Girl", artist: "The Temptations" },
  { title: "What A Wonderful World", artist: "Louis Armstrong" },
  { title: "Neon Moon", artist: "Brooks & Dunn" },
  { title: "A Broken Wing", artist: "Martina McBride" },
  { title: "Turn The Page", artist: "Bob Seger" },
  { title: "Nuthin' But A 'G' Thang", artist: "Dr. Dre & Snoop Doggy Dogg" },
  { title: "The Joker", artist: "Steve Miller Band" },
  { title: "Easy", artist: "Commodores" },
  { title: "Man! I Feel Like a Woman!", artist: "Shania Twain" },
  { title: "Shallow", artist: "Lady Gaga & Bradley Cooper" },
  { title: "Mr. Brightside", artist: "The Killers" },
  { title: "What's Up?", artist: "4 Non Blondes" },
  { title: "Valerie", artist: "Amy Winehouse & Mark Ronson" },
  { title: "My Way", artist: "Frank Sinatra" },
  { title: "Flowers", artist: "Miley Cyrus" },
  { title: "Die with a Smile", artist: "Chappell Roan" },
  { title: "I Want It That Way", artist: "Backstreet Boys" },
  { title: "Wonderwall", artist: "Oasis" },
  { title: "...Baby One More Time", artist: "Britney Spears" },
  { title: "Angels", artist: "Robbie Williams" },
  { title: "All the Small Things", artist: "Blink-182" },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston" },
  { title: "You Shook Me All Night Long", artist: "AC/DC" },
  { title: "Bye Bye Bye", artist: "NSYNC" },
  { title: "Wannabe", artist: "Spice Girls" },
  { title: "It's My Life", artist: "Bon Jovi" },
  { title: "Oops!... I Did It Again", artist: "Britney Spears" },
  { title: "Love Song", artist: "Sara Bareilles" },
  { title: "Stand by Me", artist: "Ben E. King" },
  { title: "Hey Jude", artist: "The Beatles" },
  { title: "Jolene", artist: "Dolly Parton" },
  { title: "Take On Me", artist: "a-ha" },
  { title: "Superstition", artist: "Stevie Wonder" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  { title: "Shake It Off", artist: "Taylor Swift" },
  { title: "All the Small Things", artist: "Blink-182" },
  { title: "Tennessee Whiskey", artist: "Chris Stapleton" },
  { title: "My Way", artist: "Frank Sinatra" },
  { title: "Fly Me to the Moon", artist: "Frank Sinatra" },
  { title: "New York, New York", artist: "Frank Sinatra" },
  { title: "Folsom Prison Blues", artist: "Johnny Cash" },
  { title: "Ring of Fire", artist: "Johnny Cash" },
  { title: "Jackson", artist: "Johnny Cash" },
  { title: "Tainted Love", artist: "Soft Cell" },
  { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics" },
  { title: "September", artist: "Earth, Wind & Fire" },
  { title: "Walking on Sunshine", artist: "Katrina and the Waves" },
  { title: "You're Beautiful", artist: "James Blunt" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith" },
  { title: "Come Sail Away", artist: "Styx" },
  { title: "Africa", artist: "Toto" },
  { title: "Don't Stop Me Now", artist: "Queen" },
  { title: "I Want to Break Free", artist: "Queen" },
  { title: "Somebody to Love", artist: "Queen" },
  { title: "We Will Rock You", artist: "Queen" },
  { title: "We Are the Champions", artist: "Queen" },
  { title: "Another One Bites the Dust", artist: "Queen" },
  { title: "Under Pressure", artist: "Queen & David Bowie" },
  { title: "Levitating", artist: "Dua Lipa" },
  { title: "Bad Guy", artist: "Billie Eilish" },
  { title: "Watermelon Sugar", artist: "Harry Styles" },
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "As It Was", artist: "Harry Styles" },
  { title: "Break My Heart", artist: "Dua Lipa" },
  { title: "Good 4 U", artist: "Olivia Rodrigo" },
  { title: "Drivers License", artist: "Olivia Rodrigo" },
  { title: "Someone Like You", artist: "Adele" },
  { title: "Rolling in the Deep", artist: "Adele" },
  { title: "Firework", artist: "Katy Perry" },
  { title: "Teenage Dream", artist: "Katy Perry" },
  { title: "Hot N Cold", artist: "Katy Perry" },
  { title: "Since U Been Gone", artist: "Kelly Clarkson" },
  { title: "Stronger (What Doesn't Kill You)", artist: "Kelly Clarkson" },
  { title: "Because of You", artist: "Kelly Clarkson" },
  { title: "Poker Face", artist: "Lady Gaga" },
  { title: "Bad Romance", artist: "Lady Gaga" },
  { title: "Just Dance", artist: "Lady Gaga" },
  { title: "Born This Way", artist: "Lady Gaga" },
  { title: "Only Girl (In the World)", artist: "Rihanna" },
  { title: "Umbrella", artist: "Rihanna" },
  { title: "We Found Love", artist: "Rihanna ft. Calvin Harris" },
  { title: "Stay", artist: "Rihanna ft. Mikky Ekko" },
  { title: "Don't Stop the Music", artist: "Rihanna" },
  { title: "Call Me Maybe", artist: "Carly Rae Jepsen" },
  { title: "Shake It", artist: "Metro Station" },
  { title: "Party in the U.S.A.", artist: "Miley Cyrus" },
  { title: "Wrecking Ball", artist: "Miley Cyrus" },
  { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
  { title: "SexyBack", artist: "Justin Timberlake" },
  { title: "Rock Your Body", artist: "Justin Timberlake" },
  { title: "Cry Me a River", artist: "Justin Timberlake" },
  { title: "A Thousand Miles", artist: "Vanessa Carlton" },
  { title: "Sk8er Boi", artist: "Avril Lavigne" },
  { title: "Complicated", artist: "Avril Lavigne" },
  { title: "Girlfriend", artist: "Avril Lavigne" },
  { title: "The Middle", artist: "Zedd, Maren Morris & Grey" },
  { title: "We Are Young", artist: "Fun. ft. Janelle Monáe" },
  { title: "Some Nights", artist: "Fun." },
  { title: "Sugar", artist: "Maroon 5" },
  { title: "Moves Like Jagger", artist: "Maroon 5 ft. Christina Aguilera" },
  { title: "Payphone", artist: "Maroon 5 ft. Wiz Khalifa" },
  { title: "This Love", artist: "Maroon 5" },
  { title: "She Will Be Loved", artist: "Maroon 5" },
  { title: "Don't Let Me Down", artist: "The Chainsmokers ft. Daya" },
  { title: "Closer", artist: "The Chainsmokers ft. Halsey" },
  { title: "Stitches", artist: "Shawn Mendes" },
  { title: "There's Nothing Holdin' Me Back", artist: "Shawn Mendes" },
  { title: "Treat You Better", artist: "Shawn Mendes" },
  { title: "Havana", artist: "Camila Cabello ft. Young Thug" },
  { title: "Señorita", artist: "Shawn Mendes & Camila Cabello" },
  { title: "Love Me Like You Do", artist: "Ellie Goulding" },
  { title: "Lights", artist: "Ellie Goulding" },
  { title: "Burn", artist: "Ellie Goulding" },
  { title: "Jar of Hearts", artist: "Christina Perri" },
  { title: "Fight Song", artist: "Rachel Platten" },
  { title: "All About That Bass", artist: "Meghan Trainor" },
  { title: "Me Too", artist: "Meghan Trainor" },
  { title: "Dear Future Husband", artist: "Meghan Trainor" },
  { title: "No", artist: "Meghan Trainor" },
  { title: "7 Rings", artist: "Ariana Grande" },
  { title: "Break Free", artist: "Ariana Grande ft. Zedd" },
  { title: "Into You", artist: "Ariana Grande" },
  { title: "Dangerous Woman", artist: "Ariana Grande" },
  { title: "Bang Bang", artist: "Jessie J, Ariana Grande, Nicki Minaj" },
  { title: "Price Tag", artist: "Jessie J ft. B.o.B" },
  { title: "Domino", artist: "Jessie J" },
  { title: "Roar", artist: "Katy Perry" },
  { title: "California Gurls", artist: "Katy Perry ft. Snoop Dogg" },
  { title: "Fireflies", artist: "Owl City" },
  { title: "Counting Stars", artist: "OneRepublic" },
  { title: "Apologize", artist: "Timbaland ft. OneRepublic" },
  { title: "Secrets", artist: "OneRepublic" },
  { title: "Unwritten", artist: "Natasha Bedingfield" },
  { title: "Pocketful of Sunshine", artist: "Natasha Bedingfield" },
  { title: "Put Your Records On", artist: "Corinne Bailey Rae" },
  { title: "Lucky", artist: "Jason Mraz & Colbie Caillat" },
  { title: "I'm Yours", artist: "Jason Mraz" },
  { title: "I Won't Give Up", artist: "Jason Mraz" },
  { title: "Bleeding Love", artist: "Leona Lewis" },
  { title: "Halo", artist: "Beyoncé" },
  { title: "Irreplaceable", artist: "Beyoncé" },
  { title: "If I Were a Boy", artist: "Beyoncé" },
  { title: "Single Ladies (Put a Ring on It)", artist: "Beyoncé" },
  { title: "Big Girls Don't Cry", artist: "Fergie" },
  { title: "Glamorous", artist: "Fergie ft. Ludacris" },
  { title: "London Bridge", artist: "Fergie" },
  { title: "Shut Up and Dance", artist: "WALK THE MOON" },
  { title: "Sucker", artist: "Jonas Brothers" },
  { title: "Cool", artist: "Jonas Brothers" },
  { title: "Burnin' Up", artist: "Jonas Brothers" },
  { title: "Pompeii", artist: "Bastille" },
  { title: "Riptide", artist: "Vance Joy" },
  { title: "Chandelier", artist: "Sia" },
  { title: "Titanium", artist: "David Guetta ft. Sia" },
  { title: "Elastic Heart", artist: "Sia" },
  { title: "Stay With Me", artist: "Sam Smith" },
  { title: "Too Good at Goodbyes", artist: "Sam Smith" }
];

const RandomSongGenerator = ({ onSelect }) => {
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const [randomSelection, setRandomSelection] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [songQueue, setSongQueue] = useState(shuffleArray([...songs]));
  const [artistQueue, setArtistQueue] = useState(shuffleArray([...new Set(songs.map(song => song.artist))]));

  const pickRandomSong = () => {
    if (songQueue.length === 0) setSongQueue(shuffleArray([...songs])); // Reshuffle when empty
    const nextSong = songQueue.pop();
    setSongQueue([...songQueue]); // Update queue state
    setRandomSelection(nextSong);
  };
  

  const pickRandomArtist = () => {
    if (songs.length === 0) return; // Ensure there's data
  
    const uniqueArtists = [...new Set(songs.map(song => song.artist))]; // Extract unique artists
    const artist = uniqueArtists[Math.floor(Math.random() * uniqueArtists.length)];
  
    setRandomSelection({ artist }); // Store as an object to match existing selection format
  };
  
  
  return (
<div className="relative w-full max-w-md mx-auto p-6 bg-gray-900 rounded-2xl shadow-white  shadow-xl">
<button 
  type="button" // ⛔ Prevents form submission
  title="Trouble picking a song? Get some inspiration from our list of the most played karaoke songs!"
  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
  onClick={(event) => {
    event.preventDefault(); // Ensures no form submission
    setIsDropdownOpen(!isDropdownOpen);
  }}
>
  Random Song Generator ⬇️
</button>

      {isDropdownOpen && (
        <div className="mt-2 bg-white shadow-lg rounded-lg p-4">
          <div className="flex flex-col items-center space-y-4">
          <button 
  onClick={(event) => {
    event.preventDefault(); // ⛔ Prevent form submission
    pickRandomSong();
  }} 
  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
>
  Pick a Random Song
</button>

<button 
  onClick={(event) => {
    event.preventDefault(); // ⛔ Prevent form submission
    pickRandomArtist();
  }} 
  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
>
  Pick a Random Artist
</button>

          </div>
          <div className="mt-4">
            {randomSelection && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }} 
 animate={{ opacity: 1, y: 0 }}
 className="cursor-pointer p-6 text-center bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300"
>

                {randomSelection.title ? (
                  <p className="text-lg font-semibold">
                    {randomSelection.title} by {randomSelection.artist}
                  </p>
                ) : (
                  <p className="text-lg font-semibold">🎤 Artist:<br/> {randomSelection.artist}</p>
                )}
                <p className="text-sm text-white italic">(Click to autofill)</p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomSongGenerator;
