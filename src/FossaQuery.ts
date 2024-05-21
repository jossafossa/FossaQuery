interface FossaQueryList {
  find: (selector: string) => FossaQueryList;
  closest: (selector: string) => FossaQueryList;
  setAttribute: (name: string, value: string) => FossaQueryList;
  classList: {
    add: (name: string) => FossaQueryList;
  };
  addClass: (name: string) => FossaQueryList;
}

class FossaQueryList implements FossaQueryList {
  children: HTMLElement[];
  // length: number;
  constructor(children: HTMLElement[]) {
    this.children = children;
    // this.length = children.length;

    this.addClass = (className) =>
      this.forEachFunction((child) => child.classList.add(className));

    this.removeClass = (className) =>
      this.forEachFunction((child) => child.classList.remove(className));

    this.toggleClass = (className) =>
      this.forEachFunction((child) => child.classList.toggle(className));

    this.closest = (selector) =>
      this.transformFunction((child) => child.closest(selector));

    this.setAttribute = (name, value) =>
      this.forEach("setAttribute", name, value);

    this.on = (event, callback) =>
      this.forEach("addEventListener", event, callback);
  }

  find(selector: string) {
    return this.transformFunction((child) => child.querySelectorAll(selector));
  }

  scopedQuerySelectorAll(element: HTMLElement, selector: string) {
    // replace "> " with ":scope >" on the start of the selector
    selector = selector.replace(/^>\s/, ":scope > ");
    return element.querySelectorAll(selector);
  }

  applyFunction(object: any = this, path: string, args: any[]) {
    const keys = path.split(".");
    let current = object;
    let last = current;
    for (const key of keys) {
      last = current;
      current = current[key];
      if (current === null) return null;
    }
    return current.apply(last, args);
  }

  forEachFunction(callback: (child: HTMLElement) => void) {
    this.children.forEach((child) => {
      callback(child);
    });
    return this;
  }

  /**
   * Takes a callback function and applies it to each child in the list. The output is a new FossaQueryList with the new children.
   * @param callback The function to apply to each child
   * @returns A new FossaQueryList with the new children
   */
  transformFunction(
    callback: (child: HTMLElement) => HTMLElement[]
  ): FossaQueryList {
    let newChildren = new Map();
    this.children.forEach((child) => {
      let items = callback(child);

      // make sure items is an array
      if (items instanceof HTMLElement) items = [items];

      [...items].forEach((result: HTMLElement) => {
        newChildren.set(result, 1);
      });
    });

    return new FossaQueryList([...newChildren.keys()]);
  }

  /**
   * Takes a function name and arguments and invokes it on each child in the list. The output is a new FossaQueryList with the new children.
   * @param func The function to apply to each child
   * @param args The arguments to pass to the function
   * @returns A new FossaQueryList with the new children
   */
  transform(func: string, ...args: any[]) {
    return this.transformFunction((child) => {
      if (!(func in child)) return [];
      return child[func](...args);
    });
  }

  forEach(func: string, ...args: any[]) {
    this.children.forEach((child) => {
      if (!(func in child)) return;
      child[func](...args);
    });
    return this;
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index === this.children.length) {
          return { done: true };
        }
        return {
          value: this.children[index++],
          done: false,
        };
      },
    };
  }

  // Override valueOf to determine the boolean value
  [Symbol.toPrimitive](hint) {
    if (hint === "boolean") {
      return this.children.length > 0;
    }
    return this.children.length > 0 ? "1" : "0"; // Fallback for other hints
  }
}

export default (selector: string) => {
  let list = new FossaQueryList([document.documentElement]);
  return list.find(selector);
};
