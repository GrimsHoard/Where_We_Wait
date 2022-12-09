let main = document.querySelector("main");
let input = document.querySelector("input");

function print(text) {
  // to print some text we first create a new paragraph tag, like having a <p></p> in HTML
  var p = document.createElement("p");
  // Then we put our text inside the new p element
  p.innerHTML = text;
  // We add our p element to the document as the last thing in the html body
  main.appendChild(p);
  // The player may have scrolled the page, so make sure we scroll to make the new text visible
  p.scrollIntoView();
}

var character = { inventory: [], memories: [], location: "hello" };

//FIX: finish changing ME's font red

let helloText = "<i><b>wait</b> around.</i><br>"
let waitText = "<br>YOU wait for ME. As you have been doing so for a long time, as you will be doing for much longer." +
                " There <i>is</i> nothing else for you to wait for, so wait only with ME.<br>" 
let stayText = "What an excellent choice, I am proud of you. After all, who would choose to exist if it only meant suffering? It is better for US that you wait here, with ME." +
                "The voice that speaks envelopes you. " 
let stayText2 = " Wait with ME. Wait with ME. Wait with ME. "
let sufferText = "Is that so? Then I guarantee should you choose this you will wake to suffering." + 
                " A suffering that does not end, in a loop that has no break, round and round you’ll go," + 
                " tormented by your own choice of existence where you are promised suffering—" +
                "<br><br> So why not extend your wait a little while longer. What is one more day in This Place." +
                " Knowing all that pain that is to come, are you certain you wish to stop waiting? "
let mercyText = "I will offer you this mercy only once: Will YOU wait with ME?"
let mercyRefusedText = "I've already offered you my mercy...if you so wish to sqaunder it, then so be it."
let existText = "If you are so determined, then who am I to keep you from your suffering."

var dungeon = {
  "hello": {
    short_description: "first choice",
    long_description:
      "<b>Introduction:</b> <br>Hello! Welcome to the demo for Where We Wait! Well, at least, an incomplete demo for an incomplete story. " + 
      "Turns out learning to program a game often takes more than 10 hours, who would have known.<br>" + 
      "<br>Anyways! Let’s get the basics out of the way so your ready to play. For the curious, type in <b>about</b> to learn more about the game. " +
      "For first time players I recommend typing in <b>help</b> when you find yourself stuck. "+ 
      "And for those familiar with text-based adventure games, why don’t you—<i>" + helloText.fontcolor("red"),
    contents: [],
    exits: {wait: "waiting"}
  },
  "waiting": {
    short_description: "This is where we wait",
    long_description:
      "<br><b>Where We Wait:</b><br> You are waiting.<br>" +
      "<br>At least, you suppose this is what waiting must feel like. Existing endlessly, surrounded by your own thoughts." + 
      " There is nothing to see, nothing to do, but only to wait, wait and listen to that voice.<br>" +
      " <br>There <i>is</i> a voice here somewhere. It speaks only on the occasion that you wonder what exactly you are waiting for." + 
      " It’s sounds like a whisper as it speaks:<br>" + 
      waitText.fontcolor("red") + 
      "<br>Despite the lulling sense of calm the voice carries, attempting to dissuade your curiosities," + 
      "the idea still fills your mind on what exactly would happen if you simply….stop waiting.<br>",
    contents: [],
    exits: { wait: "empty", stop: "first_choice"}
  },
  "empty": {
    short_description: "loop opportunity",
    long_description: "You choose to wait.",
    exits: {stop: "first_choice"}
  },
  "waiting2": {
    short_description: "wait longer",
    long_description:
      "<b>Waiting?:</b> <br> You've done this before, haven't you? Waiting....just like the rest.",
    contents: [],
    exits: { wait: "waiting"}
  },
  "yes1": {
    short_description: "you wait",
    long_description:
      stayText.fontcolor("red") + 
      "There is no comfort to this but there is no pain either. Only you and the whisperings of a voice that lull you to wait." +
      stayText2.fontcolor("red") +
      "So you wait until the day you exist.",
    contents: ["waiting"],
    exits: {wait: "waiting2"}
  },
  "exist": {
    short_description: "suffering",
    long_description:
      existText.fontcolor("red") +
      "THE END. Well, it's not really the end the demo has ALOT more stuff to it but this is where I hit ten hours" +
      " and I have other projects to work on unfortunatley. But please feel welcome to play through the demo again" +
      "there should be a few other ways to get to the end.",
    contents: [],
    exits: {}
  },
  "no1": {
    short_description: "You refuse to wait any longer",
    long_description:
      sufferText.fontcolor("red"),
    contents: [],
    exits: {yes: "exist", no: "no2"}
  },
  "no2": {
    short_description: "you wait",
    long_description:
    stayText.fontcolor("red") +
    "So you wait until the day you exist.",
    contents: ["waiting"],
    exits: {wait: "waiting2"}
  },
  first_choice: {
    short_description: "choices",
    long_description:
      mercyText.fontcolor("red"),
    contents: [],
    exits: {yes: "yes1", no: "no1"}
  },
  first_choice2: {
    short_description: "choices",
    long_description:
      mercyRefusedText.fontcolor("red")+
      "THE END. Well, it's not really the end the demo has ALOT more stuff to it but this is where I hit ten hours" +
      " and I have other projects to work on unfortunatley. But please feel welcome to play through the demo again" +
      "there should be a few other ways to get to the end.",
    contents: [],
    exits: {}
  },
};

function command_split(str) {
  var parts = str.split(/\s+/); // splits string into an array of words, taking out all whitespace
  var command = parts.shift(); // command is the first word in the array, which is removed from the array
  var object = parts.join(" "); // the rest of the words joined together.  If there are no other words, this will be an empty string
  return [command, object];
}

var room, command, verb, obj;

function remove(array, item) {
  var idx = array.indexOf(item);
  if (idx > -1) {
    array.splice(idx, 1);
  }
}

function long_direction(short) {
  let key = short[0];
  return {
    n: "north",
    e: "east",
    w: "west",
    u: "up",
    d: "down",
    i: "in", // we don't actually use this short form, because 'inventory'
    m: "memories",
    r: "remember",
    n: "no",
    o: "out",
    w: "wait",
    y: "yes",
    s: "stop"
  }[key];
}

function move_to_room(room_name) {
  console.log(room_name);
  character.location = room_name;
  room = dungeon[room_name];
  describe(room);
}

let waits = 0;
let stops = 0; 
function move(verb) {
  let direction = long_direction(verb); // fix up abbreviations

  // special cases for movement
  if (direction === "wait" && room.short_description === "This is where we wait") {
    move_to_room("empty");
  } 

  else if(direction === "wait" && room.short_description === "loop opportunity") {

      if(waits === 0) {
        print("You choose to wait....");
      }
      else if (waits === 1) {
        print("You choose to wait...but....is it really your choice at all?");
      }
      else if (waits === 2) {
        let text = "Of course it is YOUR choice. YOUR choice is to wait here with ME.";
        print(text.fontcolor("red"));
      }
      else if (waits === 3) {
        print("You choose to wait....it is your choice....");
      }
      else {
        print("YOU wait.");
      }

      waits++;
  }

  else if(direction === "stop" && room.short_description === "loop opportunity") {
    
    if(stops === 0) {
      let text = "Stop? You wish to <b>stop?</b> Do you not enjoy waiting with ME? <i>Aren't YOU much happier here?</i> Waiting? How ridiculous that you should want to stop, wait a little while longer."
      print(text.fontcolor("red")); 
    }
    else if (stops === 1) {
      let text = "Again with this. You're confused. You don't understand what you want but I do. I know YOU. So wait with ME.";
      print(text.fontcolor("red"));
    }
    else if (stops === 2) {
      let text = "YOU will wait.";
      print(text.fontcolor("red"));
    }
    else {
      let text = "Why do YOU persist in this ridiculous idea! Stopping? YOU wish to stop? YOU wish to have that choice? Then fine, have your choice:";
      print(text.fontcolor("red"));
      move_to_room("first_choice");
    }

    stops++;

  }

  else if (direction === "wait" && room.short_description === "wait longer") {
    print("WE understand. This waiting that is. Wait as long as you need, WE will be here until then.");
  }

  else if (direction === "stop") {
    if(room.short_description === "wait longer") {
      move_to_room("first_choice2");
    }

    if(room.short_description === "This is where we wait") {
      let text = "You...wish to stop? Oh? Oh! I see. YOU want the choice to wait, very well, then I'll give you that choice.";
      print(text.fontcolor("red"))
      move_to_room("first_choice");
    }
  }

  else if (room.exits[direction]) {
    // general case for move
    move_to_room(room.exits[direction]);
  } else {
    print("Unaccepted input");
  }

  //check for memories
  if(room.short_description === "you wait") {
    let memory = "waiting"
    print("[New Core Memory Unlocked: " + memory + "]");
    character.memories.push(memory);
    remove(room.contents, memory);

  }

}

function printAbout() {
  const about = `<br> <b>About:</b> <br>
  This version of Where We Wait is a text-based adventure game designed to lead your through a series of introspective puzzles in This Place. 
  A broken fragment of a world you think you might have once known but can’t quite remember…. <br> 
  <br>
  Should you need any help in navigating around This Place, simple type <b>help</b> and a useful memory will be restored to you. Such a memory look like this: <br>
  <br>
  [<i><b>Look:</b> Allows you to look at the current area</i><br>
    <i><b>Examine:</b> Allows you to examine an object in an area more closely</i><br>
    <i><b>Touch:</b> Touch an object within your reach</i><br>
     <i><b>Forward:</b> Allows you to move forward through This Place</i><br>
     <i><b>Backward:</b> Allows you to move back through This Place</i><br>
     <i><b>Left:</b> Allows you to move left through This Place</i><br>
     <i><b>Right:</b> Allows you to move right through This Place</i><br>
     <i><b>Grab:</b> Allows you to grab an object of interest; though what interest you might be surprising.</i><br>
     <i><b>Bag:</b> Allows you check what you have grabbed; where the items are store, not even you know</i><br>
    <i><b>Memory:</b> Allows you to remember memories you’ve gained. An action that you must take alone.</i><br>
    <i><b>Remember (memory):</b> Recall the core memories you’ve collected]</i><br>
  <br>
  You’ll find many memories in This Place, particularly important memories are called core, and can be very helpful in giving hint about your objectives. You an choose
  to <b>remember</b> these memories at any time....or not, that's up to you.
  <br>`;
  print(about);
}

function printHelp() {
    const help = `<br> <b>Help:</b>
    <br>
    [<i><b>Look:</b> Allows you to look at the current area</i><br>
      <i><b>Examine:</b> Allows you to examine an object in an area more closely</i><br>
      <i><b>Touch:</b> Touch an object within your reach</i><br>
       <i><b>Forward:</b> Allows you to move forward through This Place</i><br>
       <i><b>Backward:</b> Allows you to move back through This Place</i><br>
       <i><b>Left:</b> Allows you to move left through This Place</i><br>
       <i><b>Right:</b> Allows you to move right through This Place</i><br>
       <i><b>Grab:</b> Allows you to grab an object of interest; though what interest you might be surprising.</i><br>
       <i><b>Bag:</b> Allows you check what you have grabbed; where the items are store, not even you know</i><br>
       <i><b>Memory:</b> Allows you to remember memories you’ve gained. An action that you must take alone.</i><br>
       <i><b>Remember (memory):</b> Recall the core memories you’ve collected]</i><br>
    <br>`;
    print(help);
}

function printInventory() {
  if(character.inventory.size > 0) {
    print("You are carrying:");
    character.inventory.forEach(function(item) {
      print("&nbsp;&nbsp;&nbsp;&nbsp;" + item);
    });
  }
  else {
    print("You aren't carrying anything.");
  }

}

function printMemories() {

  if(character.memories.length === 0) {
    print("You have no memories.");
  }
  else {
    print("<br><b>Memories:</b><br> You have the following memories:");
    character.memories.forEach(function(memory) {
      print("&nbsp;&nbsp;&nbsp;&nbsp;" + memory);
    });
  }
}

function describe(room, force) {

  //print room description
  print(room.long_description);

  /*var exits = Object.keys(room.exits);
  if (exits.length > 1) {
    var last_exit = exits.pop();
    print("There are exits to the " + exits.join(", ") + " and " + last_exit);
  } else{
    print("There is an exit to the " + exits[0]);
  }
  room.contents.forEach(function(item) {
    print("There is a " + item + " here");
  });*/
}

function gain_memory(obj) {

  room.contents.forEach(function(memory) {
    if (memory.includes(obj)) {
      // does the word in obj match any part of the text of item?
      found = true;
      print("New Memory Unlocked " + memory);
      character.memories.push(memory);
      remove(room.contents, memory);
    }
  });

}

function take_item(obj) {
  if (obj === "all") {
    if (room.contents) {
      // this part: [:] makes a copy of the list so removing items works
      while (room.contents.length) {
        let item = room.contents.pop();
        print("You pick up the " + item);
        character.inventory.push(item);
      }
    } else {
      print("There is nothing to take!");
    }
  } else {
    let found = false;
    room.contents.forEach(function(item) {
      if (item.includes(obj)) {
        // does the word in obj match any part of the text of item?
        found = true;
        print("You pick up the " + item);
        character.inventory.push(item);
        remove(room.contents, item);
      }
    });
    if (!found) {
      print("There is nothing to take!");
    }
  }
}

function item_from(arr, obj) {
  for (let idx in arr) {
    let thing = arr[idx];
    console.log("is a %s a %s?", thing, obj);
    if (thing.includes(obj)) {
      return thing;
    }
  }
  return null;
}

function use_memory(obj) {
  let memory = item_from(character.memories, obj);
  if (!memory) {
    print("You do not have this memory.");
    return;
  }

  if(memory === "waiting") {
    let text = "<br> <b> Waiting:</b> <br>A memory returns to you. [<i><b>Waiting.</b> Waiting. Waiting. Why is this all that you did? All that you do? The voice haunts the corners of your mind" +
              " You can feel it...watching you somehow. A sensation you never experienced prior to bringing up the idea of stopping, of " +
              "moving on, of doing anything that wasn't waiting. You know the voice is displeased with you. This idea makes your skin crawl" +
              " but worse yet is the...things you can see now. Faded glimpses of others, they look just as scared as you feel, and somehow-someway-you know" +
              " none of YOU want to wait anymore.</i>]"
    print(text);
  }

}

function use_item(obj) {
  let item = item_from(character.inventory, obj);
  if (!item) {
    print("You aren't carrying a " + obj);
    return;
  }
}

room = dungeon[character.location];
describe(room);

function getOneCommand(text) {
  room = dungeon[character.location];
  command = command_split(text.toLowerCase());
  verb = command[0];
  obj = command[1];
  console.log("verb: " + verb + ", object: " + obj);
  if (
    [
      "right",
      "left",
      "forward",
      "backward",
      "up",
      "down",
      "in",
      "out",
      "no",
      "wait",
      "yes",
      "stop",
      "r",
      "l",
      "f",
      "b",
      "u",
      "d",
      "w",
      "y",
      "st",
    ].includes(verb)
  ) {
    move(verb);
  } else if (["inventory", "i", "bag"].includes(verb)) {
    printInventory();
  } else if (["memories", "m", "memory"].includes(verb)) {
    printMemories();
  } else if (["remember", "rm"].includes(verb)) {
    use_memory(obj);
  } else if (["help", "h"].includes(verb)) {
    printHelp();
  } else if (["about", "a"].includes(verb)) {
    printAbout();
  } else if (["look", "examine", "describe", "l"].includes(verb)) {
    print("There is nothing to see.");
  } else if (["take", "pickup", "t", "grab", "g"].includes(verb)) {
    take_item(obj);
  } else if (["use", "try", "apply"].includes(verb)) {
    use_item(obj);
  } 
}

function getInput(evt) {
  if (evt.code === "Enter") {
    let text = input.value;
    input.value = "";
    getOneCommand(text);
  }
}

input.addEventListener("keyup", getInput, false);
