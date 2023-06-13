function ahead(s1, s2) {
  let shorter = Math.max(s1.length, s2.length);
  for (let i = 0; i < shorter; i++) {
    if (s1.charAt(i) > s2.charAt(i)) {
      return false;
    }
  }
  return s1.length <= s2.length;    
}

// binary search of s on sorted list, returns index of id, -1 if id does not exist
function isRegistered(s, list) {
  let head = 0;
  let end = list.length - 1;
  let center = Math.floor((head + end) / 2);  
  while (head <= center) {
    if (s === list[center]) {
      return center;
    } else {
      if (ahead(s, list[center])) {
        end = center - 1;
      } else {
        head = center + 1;
      }
      distance = Math.floor((end - head)/2);
      center = head + distance;   
    }
  }
  return -1;
}

module.exports = {ahead: ahead, isRegistered: isRegistered};