const vendor = require('../modules/vendor');
const emitter = require('../events');

jest.useFakeTimers();

it('should receive delivery politely', () => {
  console.log = jest.fn();
  emitter.emit('delivered', { orderId : '1234' });
  expect(console.log).toHaveBeenCalledWith('VENDOR: Thank you for delivering 1234');
});

it('should emit order', () => {

  const callback = jest.fn();

  emitter.on('pickup', callback);

  expect(callback).not.toBeCalled();

  vendor.start();

  jest.runOnlyPendingTimers();

  expect(callback).toBeCalledWith(expect.objectContaining({store:'fake-store-inc'}));

  expect(callback).toHaveBeenCalledTimes(1);

});
