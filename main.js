import './style.css'

const leveling = {
  XP: 0,
  maxXP: 100,
  level: 1,
  maxLevel: 55
}

// Select the input, all buttons, and ul
const input = document.getElementById('checklist');
const addBtn = document.getElementById('addList');
const list = document.getElementById('myUL');
const majorQ = document.getElementById('majorQuest');
const sideQ = document.getElementById('sideQuest');
const reset = document.getElementById('reset-btn');
const confirm = document.getElementById('confirm-btn');

//#region - XP, Level, and Quest Handling -
// Handle xp based on quest selection
function handleQuestSelection()
{
  majorQ.addEventListener('change', function()
  {
    if (this.checked)
    {
      sideQ.checked = false;
      console.log('Major Quest selected..');
    }
  });

  sideQ.addEventListener('change', function()
  {
    majorQ.checked = false;
    console.log('Side Quest selected..');
  });
}
handleQuestSelection();

function setXpBasedOnQuest(item)
{
  let xpToGain = 0;

  if (item.textContent.includes('Major Quest'))
  {
    xpToGain = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
  }

  else if (item.textContent.includes('Side Quest'))
  {
    xpToGain = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
  }

  else
  {
    xpToGain = 5;
  }

  leveling.XP += xpToGain;

  while (leveling.XP >= leveling.maxXP)
  {
    leveling.XP -= leveling.maxXP; // carry over the extra xp from level up
    leveling.level += 1;
    updateMaxXpOnNewLevel(true);
    console.log(`Level Up! You are now level ${leveling.level}`);
  }
  console.log(`XP added: ${xpToGain}, Current XP: ${leveling.XP}`);

  majorQ.checked = false;
  sideQ.checked = false;
}

function handleXpOnListChange(addXP = true)
{
  if (addXP)
  {
    if (leveling.XP < leveling.maxXP)
    {
      leveling.XP += 2;
      console.log("Current XP", leveling.XP);
    }

    while (leveling.XP >= leveling.maxXP)
    {
      leveling.XP -= leveling.maxXP;
      leveling.level += 1;
      updateMaxXpOnNewLevel(true);
      console.log("You are now level", leveling.level);
    }
  }
  else
  {
    // Decrement XP for reset
    leveling.XP -= 2;

    if (leveling.XP < 0)
      leveling.XP = 0;
  }
}

function updateMaxXpOnNewLevel(levelUp = false)
{
  if (levelUp)
  {
    let baseMinXP = 150 + (leveling.level - 2) * 200;
    let baseMaxXP = 250 + (leveling.level - 2) * 200;
    leveling.maxXP = Math.floor(Math.random() * (baseMaxXP - baseMinXP + 1) + baseMinXP);
    console.log(`New max xp is: ${leveling.maxXP}`);
  }
}
//#endregion

//#region - List Element Handling -
// Create new list item when clicking Add Button or Enter
function addItem()
{
  const inputVal = input.value.trim(); // trim is used to remove any whitespace from the input to keep it from being added
  const currItems = list.getElementsByTagName('li'); // current li elems
  const specialChar = /[!@#$%^&*(),.?":{}|<>\/]/;

  if (!inputVal) // Prevent from adding empty item
  {
    alert("Text is empty! Please add text to the input...");
    return;
  }

  if (specialChar.test(inputVal)) // Check for special characters
  {
    alert("Please do not use special characters in list");
    return;
  }

  for (let i = 0; i < currItems.length; i++) // v Prevent from using duplicate items in list v
  {
    if (currItems[i].textContent.toLowerCase().includes(inputVal.toLowerCase()))
    {
      alert("You already have that item in the list...");
      return;
    }
  }

  if (currItems.length >= 7)
  {
    console.log("Maximum number of elements have been added to the list.. Please remove one or reset list to continue!");
    alert("Maximum number of elements have been added to the list.. Please remove one or reset list to continue!");
    return;
  }

  const li = document.createElement('li');

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'check-off-item';
  li.appendChild(checkbox);

  // Text Node
  const textSpan = document.createElement('span');
  textSpan.textContent = `${inputVal} | `;
  li.appendChild(textSpan);

  // Quest Type Text
  let questTypeTxt = majorQ.checked ? 'Major Quest' : sideQ.checked ? 'Side Quest' : 'Misc Quest';
  const questTypeSpan = document.createElement('span');
  questTypeSpan.textContent = questTypeTxt;
  li.appendChild(questTypeSpan);

  list.appendChild(li);
  majorQ.checked = false;
  sideQ.checked = false;
  input.value = '';

  handleXpOnListChange(true);
}

function newListElem()
{
  addBtn.addEventListener('click', addItem);
  input.addEventListener('keypress', function(e)
  {
    if (e.key === 'Enter')
    {
      addItem();
    }
  });
}
newListElem();

// Clear list element on reset
function clearOnReset()
{
  reset.addEventListener('click', function()
  {
    const itemsRemoved = list.childElementCount; // Get number of items in list
    majorQ.checked = false;
    sideQ.checked = false;

    if (itemsRemoved === 0)
    {
      alert('The list is already empty bro...');
    }
    else
    {
      input.value = '';

      while (list.firstChild)
      {
        list.removeChild(list.firstChild);
      }

      for (let i = 0; i < itemsRemoved; i++) // Deduct XP for each item that was in the list
      {
        handleXpOnListChange(false);
      }
      console.log('List cleared and XP reset');
      console.log('Current XP', leveling.XP);
    }
  });
}
clearOnReset();

function confirmChecklist()
{
  confirm.addEventListener('click', function() 
  {
    const items = list.getElementsByTagName('li');

    for (let i = items.length - 1; i >= 0; i--) 
    {
      let item = items[i];
      let checkbox = item.querySelector('input[type="checkbox"]');

      if (checkbox && checkbox.checked) 
      {
        setXpBasedOnQuest(item);
        list.removeChild(item); 
      }
    }
  });
}
confirmChecklist();
//#endregion
