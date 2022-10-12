export class Iteration {
  private readonly delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  setupAutoUpdate = async (object, func, time) => {
    for await (const curr of this.iteratorv2(object, func, time)) {
    }
  };

  private readonly iteratorv2 = (object, func, time) => {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next: async () => {
            const result = await func(object);
            await this.delay(time);
            return { value: result, done: false };
          },
        };
      },
    };
  };
}
