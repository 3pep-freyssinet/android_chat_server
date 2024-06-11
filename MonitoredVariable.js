// Create a monitored variable, do something when its value is being set or changed

// Licensed under MIT license. For a copy, see <https://opensource.org/licenses/MIT>.
// Copyright (c) 2021 yusanshi


// Define the class
// Since class declarations are not hoisted like function declarations,
// you first need to declare your class and then access it
class MonitoredVariable {
  constructor(initialValue) {
    this._innerValue = initialValue;
    this.beforeSet = (newValue, oldValue) => {};
    this.beforeChange = (newValue, oldValue) => {};
    this.afterChange = (newValue, oldValue) => {};
    this.afterSet = (newValue, oldValue) => {};
  }

  set val(newValue) {
    const oldValue = this._innerValue;
    // newValue, oldValue may be the same
    this.beforeSet(newValue, oldValue);
    if (oldValue !== newValue) {
      this.beforeChange(newValue, oldValue);
      this._innerValue = newValue;
      this.afterChange(newValue, oldValue);
    }
    // newValue, oldValue may be the same
    this.afterSet(newValue, oldValue);
  }

  get val() {
    return this._innerValue;
  }
}

// Create money as an instance of MonitoredVariable class
// If initial value if not provided, you will get undefined if trying to
// get its value using money.val
const money = new MonitoredVariable(0);

// Set some listener functions
money.beforeSet = (newValue) => {
  console.log(`Money will be set to ${newValue}`);
};
money.beforeChange = (newValue, oldValue) => {
  console.log(`Money will be changed from ${oldValue} to ${newValue}`);
};
money.afterChange = (newValue, oldValue) => {
  console.log(`Money has been changed from ${oldValue} to ${newValue}`);
};
money.afterSet = (newValue) => {
  console.log(`Money has been set to ${newValue}`);
};

// Get current value of the variable
console.log(money.val);

// What happens when you use `money.val = newValue` to change variable's value:
// 1. money.beforeSet(newValue, oldValue);
// 2. money.beforeChange(newValue, oldValue); (Will be skipped if its value not changed)
// 3. money.val = newValue;
// 4. money.afterChange(newValue, oldValue); (Will be skipped if its value not changed)
// 5. money.afterSet(newValue, oldValue);

// Set a new value for the variable
money.val = 2;
