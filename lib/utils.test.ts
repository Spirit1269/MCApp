import { cn } from './utils';

describe('cn', () => {
  it('concatenates class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
});
