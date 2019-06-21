const { typePicker } = require('../');

const user = {
  name: 'Tom',
  age: 22,
  sex: 'male',
  education: [
    {
      city: 'Shanghai',
      school: 'No.1 high school',
      score: null,
    },
    {
      city: 'Beijing',
      school: 'Beijing University',
      gpa: 100.0,
    },
  ],
  birthday: new Date('2000-01-01'),
  verbose: 'there are some thing do not wang to output.',
};

// ----------------------------------------------------------------------------
const samplePicker = typePicker({
  name: String,
  age: Number,
});

console.log(samplePicker(user));
// { name: 'Tom', age: 18 }

// ----------------------------------------------------------------------------
const detailedPicker = typePicker({
  name: String,
  age: Number,
  sex: String,
  birthday: Date,
  education: [
    {
      city: String,
      gpa: Number,
    },
  ],
});

console.log(detailedPicker(user));
// there order is same as detailedPicker defined
/*
{
  "name": "Tom",
  "age": 22,
  "sex": "male",
  "birthday": "2000-01-01T00:00:00.000Z",
  "education": [
    {
      "city": "Shanghai" // only "gpa" isNumber will be picked
    },
    {
      "city": "Beijing",
      "gpa": 100
    }
  ]
}
 */
