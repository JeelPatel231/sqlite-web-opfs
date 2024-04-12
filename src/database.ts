import { DataSource, Entity, PrimaryGeneratedColumn } from "typeorm/browser";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
}

async function getDBFileHandle() {
  const opfsRoot = await navigator.storage.getDirectory()
  return await opfsRoot.getFileHandle("db.sqlite3", {
    create: true,
  });
}

async function createInitializedDataSource() {
  const fileHandle = await getDBFileHandle()
  const fileObj = await fileHandle.getFile()
  const arrayBuffer = await fileObj.arrayBuffer();
  const dataSource = await new DataSource({
      type: "sqljs",
      sqlJsConfig: {
        locateFile: (file: string) => file,
      },
      database: new Uint8Array(arrayBuffer),
      autoSave: true,
      entities: [User],
      autoSaveCallback: async (uint8Arr: Uint8Array) => {
        const writeable = await (fileHandle as any).createWritable()
        writeable.write(uint8Arr)
        writeable.close()
      },
      synchronize: true,
  }).initialize()

  return dataSource;
}

export class Database {
  private _ds: Promise<DataSource> = createInitializedDataSource()
  
  async getDataSource() {
    return await this._ds;
  }
}

export const db = new Database();
