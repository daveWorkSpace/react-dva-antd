import { serial as test } from 'ava';
import Storage from '../../../src/application/library/storage'

test('storage.init.success.container', (t) => {
  { //测试 container
    const namespace = 'storage.init.with.container'
    const container = 'sub'
    const data = { user: { name: 'jhone', age: 19 }, class: 'a' }
    const storage = new Storage(namespace, { container })
    storage.set(data);
    t.truthy(storage)
    t.is(storage.container, container)
    t.is(storage.namespace, namespace)
    t.deepEqual(storage.data, data)

    //测试父级清空后，容器自动清空
    const another = new Storage(namespace)
    t.truthy(another)
    t.is(another.container, undefined)
    t.is(another.namespace, namespace)
    t.deepEqual(storage.data, data)
    t.deepEqual(another.data[container], data)

    //测试清空数据 another 的数据应同步清空
    another.clear()

    //测试清空数据后的数据一致性
    t.deepEqual(storage.data, {})
    t.deepEqual(another.data, {})

    //测试重新设置容器数据
    storage.set(data)
    t.deepEqual(storage.data, data)
    t.deepEqual(another.data[container], data)
  }
})

test.beforeEach((t) => {
  //每个用例测试前初始化存储对象，并且清空容你内部数据
  const namespace = 'storage.test.each.container'
  const storage = new Storage(namespace, { container: 'container' })
  storage.clear()
  t.deepEqual(storage.data, {})

  t.context.storage = storage
});

test('storage.setter.error', (t) => {
  const { storage } = t.context;
  //错误数据类型
  const testerKeys = [
    undefined,
    null,
    0,
    123,
    'string',
    '!123',
    '!@#$%^&*()',
    NaN,
  ]

  //错误的键值对
  const testerVals = [
    { key: { val: 'should be none' }, val: 'not none' },
    { key: ['val', 'should', 'be', 'none'], val: 'not none' },
  ]

  const planCount = testerKeys.length + Object.keys(testerVals).length

  t.plan(planCount)
  testerKeys.forEach((testCase, index, array) => {
    try {
      storage.set(testCase)
    } catch (e) {
      t.truthy(e)
    }
  })

  testerVals.forEach((testCase) => {
    try {
      const key = testCase.key
      const val = testCase.val
      storage.set(key, val)
    } catch (e) {
      t.truthy(e)
    }
  });
})

test('storage.dataType', (t) => {
  const { storage } = t.context;
  {
    const data = {
      user: { name: 'jhone', age: 19, contact: { mobile: '1234567890' } },
      notNone: 'hasValue',
      notDele: 'notDele',
    };

    const result = storage.set(data);
    t.deepEqual(result, data);

    //测试获取数据
    t.is(storage.get('user.name'), data.user.name)
    t.is(storage.get('user.contact.mobile'), data.user.contact.mobile)
    t.deepEqual(storage.get('user'), data.user)
    t.deepEqual(storage.get('user.contact'), data.user.contact)
    t.deepEqual(storage.get(), data)
    t.deepEqual(storage.data, data)
  }
  {
    const data = [
      { name: 'jhone', age: 19, contact: { mobile: '1234567890' } },
      'hasValue',
      'notDele',
    ];

    const result = storage.set(data);
    t.deepEqual(result, data);
    t.deepEqual(storage.get('0'), data[0])
    t.deepEqual(storage.get('0.name'), data[0].name)
    t.deepEqual(storage.get('1'), data[1])
    t.deepEqual(storage.data, data)
  }
});

test('storage.operation', (t) => {
  const { storage } = t.context;

  const data = {
    user: { name: 'jhone', age: 19, contact: { mobile: '1234567890' } },
    notNone: 'hasValue',
    notDele: 'notDele',
  }

  const result = storage.set(data);
  t.deepEqual(result, data);

  //测试获取数据
  t.is(storage.get('user.name'), data.user.name)
  t.is(storage.get('user.contact.mobile'), data.user.contact.mobile)
  t.deepEqual(storage.get('user'), data.user)
  t.deepEqual(storage.get('user.contact'), data.user.contact)
  t.deepEqual(storage.get(), data)
  t.deepEqual(storage.data, data)

  //测试空数据
  t.is(storage.get('notNone'), data.notNone)
  t.true(storage.has('notNone'))
  storage.set('notNone', null)
  t.is(storage.get('notNone'), null)
  t.true(storage.has('notNone'))

  //测试设置为undefined后，自动删除数据
  storage.set('notNone', undefined)
  t.is(storage.get('notNone'), undefined)
  t.false(storage.has('notNone'))

  //测试手动删除数据
  t.true(storage.has('notDele'))
  storage.delete('notDele')
  t.is(storage.get('notDele'), undefined)
  t.false(storage.has('notDele'))

  //测试替换数据
  const newData = { user: { address: 'No.11111', name: 'sarah', age: 19, contact: { mobile: '1234567890' } } }
  t.true(storage.has('user.name'))
  storage.set('user.name', 'sarah')
  t.is(storage.get('user.name'), 'sarah')

  //测试添加新数据
  t.false(storage.has('user.address'))
  storage.set('user.address', newData.user.address)
  t.is(storage.get('user.address'), newData.user.address)

  t.deepEqual(storage.get(), newData)
  t.deepEqual(storage.data, newData)

  //全部替换数据
  const replaceData = { user: [0, 1, 2, 3, 4] }
  storage.set(replaceData)
  t.deepEqual(storage.get(), replaceData)
  t.deepEqual(storage.data, replaceData)
})

test('storage.size & clear', (t) => {
  const { storage } = t.context;
  t.is(storage.size, 0);

  { //测试size取值
    const count = 100
    for (let i = 0; i < count; i += 1) {
      const key = `key${i}`;
      const val = `val${i}`;
      storage.set(key, val)
      t.is(storage.size, i + 1);
    }
    t.is(storage.size, count);

    storage.clear()
    t.is(storage.size, 0);
  }
  { //测试clear
    const count = 100
    for (let i = 0; i < count; i += 1) {
      const key = `key${i}`;
      const val = `val${i}`;
      t.is(storage.size, 0);
      storage.set(key, val)
      t.is(storage.size, 1);
      storage.clear()
      t.is(storage.size, 0);
    }
  }
})

test('storage.out.of.size', (t) => {
  const { storage } = t.context;

  // issues: https://stackoverflow.com/a/31065166
  //因为JSON.stringify转译数组，数字key特别大的数组会产生超长字符串，导致超出本地储存空间。
  //动态声明的，数组key类型为数字，死活无法转译成String
  {
    const stupidJsArray = [];
    stupidJsArray['0'] = 'a';
    stupidJsArray[String(1000)] = 'b';
    stupidJsArray[String(2000)] = 'c';
    stupidJsArray[String(3000000)] = 'd';

    try {
      const stupidJs = JSON.stringify(stupidJsArray, null, '\t');
      storage.set('outOfSize', stupidJs);
    } catch (e) {
      t.is(e.name, 'QUOTA_EXCEEDED_ERR');
      t.truthy(e);
    }
  }
})
