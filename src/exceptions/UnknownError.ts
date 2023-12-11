class UnknownError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnknownError';
        // This line is needed to restore the correct prototype chain.
        // (see note below)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export { UnknownError };
