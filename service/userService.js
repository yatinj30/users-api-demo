exports.findOne = async (users, id) => {
    let index = users.findIndex(user => user._id == id);
    if (index > -1) return users[index];
    return null;
};

exports.findByEmail = async (users, email) => {
    let index = users.findIndex(user => user.email == email);
    if (index > -1) return users[index];
    return null;
};