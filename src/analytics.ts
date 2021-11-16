function createAnalytics(): Object {
  let counter: number = 0;
  let isDestroyed: boolean = false;
  let a = [1, 2, 3, 4];

  const listener = () => counter++;
  document.addEventListener("click", listener);

  return {
    destroy() {
      document.removeEventListener("click", listener);
      isDestroyed = true;
    },
    getClicks() {
      if (isDestroyed) {
        return "Analytics were destroyed. Version 2";
      }
      return counter;
    },
    reverseArr() {
      for (let i = 0; i < a.length; i++) {
        let tempValue = a[i]
        a[i] = a[a.length - i - 1]
        a[a.length - i - 1] = tempValue
        console.log({tempValue, i: a[i], iFromEnd: a[a.length - i - 1], a })
    }
    return a
    },
    matchingStrings(strings, queries) {
      let resultArr = (new Array(queries.length)).fill(0);
      for (let i = 0; i < queries.length; i++) {
          for (let j = 0; j < strings.length; j++) {
              if (queries[i] === strings[j]) {
                  resultArr[i] += 1;
              }
          }
      }
      return resultArr;
  }
  };
}

window['analytics'] = createAnalytics();