'use strict';

const AVAILABLE = typeof localStorage !== 'undefined';

export default class LocalStorage {

    constructor(namespace) {
        this.namespace = namespace;
    }

    create(name, value) {
        if (!AVAILABLE) {
            this._unavailable();
        } else if (name && value) {
            localStorage.setItem(this._fullyQualifiedName(this, name), value);
        }
    }

    read(name) {
        return AVAILABLE ? localStorage.getItem(this._fullyQualifiedName(this, name)) || '' : this._unavailable();
    }

    update(name, value) {
        this.create(name, value);
    };

    delete(name) {
        if (AVAILABLE) {
            localStorage.removeItem(this._fullyQualifiedName(this, name));
        } else {
            this._unavailable();
        }
    };

    fetchAllMatches(startsWith, endsWith) {
        var results = [], key, match;
        startsWith = startsWith ? this._fullyQualifiedName(this, startsWith) : startsWith;
        for (key in localStorage) {
            match = false;
            if (startsWith) {
                match = key.indexOf(startsWith) === 0;
            }
            if (endsWith && (!startsWith || match)) {
                match = key.indexOf(endsWith, key.length - endsWith.length) > -1;
            }
            if (match) {
                results.push({key: key, value: localStorage[key]});
            }
        }
        return results;
    };

    _fullyQualifiedName(ls, name) {
        return ls.namespace + '.' + name;
    }

    _unavailable() {
        throw new Error('Local storage is unavailable');
    }

    static factory(namespace){
        return new LocalStorage(namespace);
    }
}

LocalStorage.factory.$inject = [];