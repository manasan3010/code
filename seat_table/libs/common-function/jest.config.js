module.exports = {
  name: 'common-function',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/common-function',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
