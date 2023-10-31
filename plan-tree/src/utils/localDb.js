let baseData = null;

class LocalStorageHander {
    prefix = 'lirongping';
    getData(id, defaultData = {}) {
        if (!baseData) {
            if (window.vscode) {
                baseData = JSON.parse(window.initTreeData)
            } else {
                baseData = [
                    {
                        "id": "root", 
                        "data": {
                            "title": "根节点",
                            "id": "root",
                            "idIndex": 4,
                            "cols": [
                                {
                                    "width": "100",
                                    "cards": [{ "id": "root_2" }]
                                }
                            ]
                        }
                    },
                    {
                        "id": "root_2",
                        "data": {
                            "title": "实力",
                            "id": "root_2", "idIndex": 1,
                            "cols": [{ "width": "100", "cards": [] }]
                        }
                    }
                ]
            }
        }
        return baseData;
    }
    setData(id, data) {
        console.log(id, data);
        baseData = baseData;
        console.log(JSON.stringify(baseData));
        if (window.vscode) {
            window.vscode.postMessage({
                command: 'save',
                exportData:
                    JSON.stringify(baseData, null, 4),
            });
        }
    }
}
export default class LocalDb extends LocalStorageHander {
    async getProjectList(projectType) {
        const list = this.getData('projectList', []);
        if (projectType) {
            return list.filter((item) => {
                return item.type == projectType;
            });
        } else {
            return list;
        }
    }
    async createProject(projectName, projectType, description) {
        const list = await this.getProjectList();
        const projectData = {
            name: projectName,
            type: projectType,
            id: list.length,
            description: description
        };
        list.push(projectData);
        this.setData('projectList', list);
        return projectData;
    }
    getProject(id) {
        return new LocalProject(id);
    }
}
class LocalProject extends LocalStorageHander {
    constructor(id) {
        super();
        this.id = id;
    }
    async getItemList() {
        const data = this.getData(this.id, []);
        return data;
    }
    async getItem(id) {
        const data = this.getData(this.id, []);
        const result = data.find(item => {
            return item.id == id;
        });
        return result ? result.data : null;
    }
    async delItem(id) {
        const data = this.getData(this.id, []);
        const result = data.filter(item => {
            return item.id != id;
        });
        this.setData(this.id, result);
    }
    async setItem(id, data) {
        const oldData = this.getData(this.id, []);
        let isExist = false;
        for (var i = 0; i < oldData.length; i++) {
            if (oldData[i].id == id) {
                isExist = true;
                oldData[i].data = data;
            }
        }
        if (!isExist) {
            oldData.push({
                id: id,
                data: data
            });
        }
        this.setData(this.id, oldData);
    }
}