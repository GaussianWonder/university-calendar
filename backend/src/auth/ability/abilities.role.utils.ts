export interface RoleInfo<Subject, Title> {
  subject: Subject;
  subjectId: number;
  title: Title;
}

export type Mapper<T, U> = (t: T) => U;

export default class RoleIdentifier<Subject, SubjectRole, RoleTitle> {
  private roleInfoProvider: Mapper<SubjectRole, RoleInfo<Subject, RoleTitle>>;
  private titlesMap: Map<number, RoleInfo<Subject, RoleTitle>[]> = new Map();

  constructor(
    roleInfoProvider: Mapper<SubjectRole, RoleInfo<Subject, RoleTitle>>,
    roleArray: SubjectRole[] | null = null,
  ) {
    this.roleInfoProvider = roleInfoProvider;
    if (roleArray != null) {
      this.from(roleArray);
    }
  }

  public from(roleArray: SubjectRole[]) {
    roleArray.map(this.roleInfoProvider).forEach((roleInfo) => {
      const { subjectId } = roleInfo;
      const titles = this.titlesMap.get(subjectId) || [];
      titles.push(roleInfo);
      this.titlesMap.set(subjectId, titles);
    });
    return this;
  }

  public titlesOf(id: number): RoleInfo<Subject, RoleTitle>[] {
    return this.titlesMap.get(id) || [];
  }

  public hasTitleFor(id: number): boolean {
    return this.titlesMap.has(id);
  }

  public has(id: number, title: RoleTitle): boolean {
    const titles = this.titlesOf(id);
    return titles.some((t) => t.title === title);
  }

  public not(id: number, title: RoleTitle): boolean {
    if (!this.hasTitleFor(id)) return false; //* important
    const titles = this.titlesOf(id);
    return titles.every((t) => t.title !== title);
  }

  public hasAnyOf(id: number, titles: RoleTitle[]): boolean {
    const subjectTitles = this.titlesOf(id);
    return subjectTitles.some((t) => titles.includes(t.title));
  }

  public hasAllOf(id: number, titles: RoleTitle[]): boolean {
    const subjectTitles = this.titlesOf(id);
    return (
      subjectTitles.length &&
      titles.every((t) => subjectTitles.some((st) => st.title === t))
    );
  }

  public rolesMatching(
    predicate: (role: RoleInfo<Subject, RoleTitle>) => boolean,
  ): RoleInfo<Subject, RoleTitle>[] {
    return this.ids
      .map((id) => this.titlesOf(id))
      .flat()
      .filter(predicate);
  }

  public idsMatching(
    predicate: (role: RoleInfo<Subject, RoleTitle>) => boolean,
  ): number[] {
    return this.rolesMatching(predicate).map((role) => role.subjectId);
  }

  get ids() {
    return Array.from(this.titlesMap.keys());
  }

  public match(
    matchers: Array<[RoleTitle, (info: RoleInfo<Subject, RoleTitle>) => void]>,
  ) {
    this.ids.forEach((id) => {
      matchers.forEach(([title, callback]) => {
        if (this.has(id, title)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          callback(this.titlesOf(id).find((t) => t.title === title)!);
        }
      });
    });
  }

  public notMatch(
    matchers: Array<
      [RoleTitle, (info: RoleInfo<Subject, RoleTitle>[]) => void]
    >,
  ) {
    this.ids.forEach((id) => {
      matchers.forEach(([title, callback]) => {
        if (this.not(id, title)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          callback(this.titlesOf(id).filter((t) => t.title !== title)!);
        }
      });
    });
  }

  public multipleMatch(
    matchers: Array<
      [RoleTitle[], (info: RoleInfo<Subject, RoleTitle>[]) => void]
    >,
  ) {
    this.ids.forEach((id) => {
      matchers.forEach(([titles, callback]) => {
        if (this.hasAnyOf(id, titles)) {
          callback(this.titlesOf(id).filter((t) => titles.includes(t.title)));
        }
      });
    });
  }
}
