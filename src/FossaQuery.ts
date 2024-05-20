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
  constructor(children: HTMLElement[]) {
    this.children = children;

    // let aliasesList = {
    //   transformFunction: [
    //     ["querySelectorAll", "find", "querySelector"],
    //     ["closest"],
    //   ],
    //   iterateFunction: [["setAttribute"], ["classList.add", "addClass"]],
    //   check: [["matches"]],
    // };

    // Object.entries(aliasesList).forEach(([func, aliases]) => {
    //   aliases.forEach((items) => {
    //     items = Array.isArray(items) ? items : [items];
    //     let item = items.shift();

    //     this[item] = (...args) => this[func](item, ...args);

    //     this.setProperty(item, func);

    //     this.alias(item, items);
    //   });
    // });

    this.find = (selector: string) =>
      this.transform((e) => e.querySelectorAll(selector));
  }

  // bindAttribute(path: string, value: string) {
  //   let keys = path.split(".");

  //   for (const key of keys) {
  //     this.children.forEach((child) => {
  //       child[key] = child[key] ? child[key] : value;
  //     });
  //   }
  // }

  // setProperty(path: string, func: string) {
  //   let keys = path.split(".");

  //   let current = this;
  //   Object.entries(keys).forEach(([i, value]) => {
  //     if (parseInt(i) === keys.length - 1)
  //       current[value] = (...args) => this[func](path, ...args);
  //     if (i < keys.length - 1) {
  //       this[value] = {};
  //       current = this[value];
  //     }
  //   });
  //   return this;
  // }

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

  // alias(name: string, aliases: string[]) {
  //   aliases.forEach((e: string) => {
  //     this[e] = this[name];
  //   });
  // }

  iterate(callback: (child: HTMLElement) => void) {
    this.children.forEach((child) => {
      callback(child);
    });
    return this;
  }

  transform(callback: (child: HTMLElement) => HTMLElement[]) {
    let newChildren = new Map();
    this.children.forEach((child) => {
      callback(child).forEach((result: HTMLElement) => {
        newChildren.set(result, 1);
      });
    });
    return new FossaQueryList([...newChildren.keys()]);
  }

  transformFunction(func: string, ...args: any[]) {
    return this.transform((child) => {
      if (!(func in child)) return [child];
      return child[func](...args);
    });
  }

  // iterateFunction(func: string, ...args: any[]) {
  //   this.children.forEach((children) => {
  //     this.applyFunction(children, func, args);
  //   });
  //   return this;
  // }

  // transformFunction(func: string, ...args: any[]) {
  //   let newChildren = new Map();
  //   this.children.forEach((child: { [key: string]: any }) => {
  //     if (!(func in child)) return;

  //     child[func](...args).forEach((result: HTMLElement) => {
  //       newChildren.set(result, 1);
  //     });
  //   });
  //   return new FossaQueryList([...newChildren.keys()]);
  // }
}

export default (selector: string) => {
  let list = new FossaQueryList([document.documentElement]);
  return list.find(selector);
};
