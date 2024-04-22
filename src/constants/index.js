const ROLE = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    REFRESHTOKEN: "x-rtoken",
    AUTHORIZATION: "authorization",
};

const LIMIT = 60;

const SORT_BY = {
    RELEVANCY: "relevancy",
    CTIME: "ctime",
    SALES: "sales",
};

module.exports = {
    ROLE,
    HEADER,
    LIMIT,
    SORT_BY,
};
