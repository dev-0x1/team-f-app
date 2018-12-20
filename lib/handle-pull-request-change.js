module.exports = async (context, config) => {
    // console.log(context,config);
    const { head, body } = context.payload.pull_request;

    let rules = { // optional fields have to be presend, <with null values>
        'Deployment Type': 'required',
        'JIRA URL': 'required',
        'Collaborators': 'required',
        'Configuration Changes':'optional',
        'Corner cases':'optional',
        'What can be affected':'optional',
    };

    const state = isValidPR(rules, body) ? 'success' : 'pending';

    const status = {
        sha: head.sha,
        state,
        target_url: 'https://github.com/anurag',
        description: 'description validation check',
        context: 'Pull Request Tests'
    };

    const result = await context.github.repos.createStatus(context.repo(status))
    return result
};

function isValidPR(rules, desc){
    let lines = desc.trim().split("\n").map(l=>l.trim());
    let failed_rules = JSON.parse(JSON.stringify(rules));
    for (let line of lines) {
        for (let rule in failed_rules) {
            if (satisfies (line, rule, failed_rules[rule])) {
                delete failed_rules[rule];
            }
        }
    }
    return failed_rules;
}

function satisfies(line, rule, type ) {
    let startsWith = line.indexOf(rule)==0;
    if (!startsWith) return false;
    if(type==='optional') {
        return true;
    }
    return true; // FIXME more checks
}

