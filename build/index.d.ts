declare let pagesContext: {
    data: Record<string, any>;
    env: Record<string, any>;
};
export declare let setPagesContext: (context: typeof pagesContext) => void;
export declare let getPagesContext: () => {
    data: Record<string, any>;
    env: Record<string, any>;
};
export declare let updatePagesData: (data: Record<string, any>) => void;
export {};
